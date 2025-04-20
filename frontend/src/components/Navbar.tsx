import Navigation from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import {
    Navbar as NavbarComponent,
    NavbarLeft,
    NavbarRight,
} from "@/components/ui/navbar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import LaunchUI from "@/components/logos/launch-ui";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";

interface NavbarLink {
    text: string;
    href: string;
}

interface NavbarActionProps {
    text: string;
    href: string;
    variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    icon?: ReactNode;
    iconRight?: ReactNode;
    isButton?: boolean;
}

interface NavbarProps {
    logo?: string;
    name?: string;
    homeUrl?: string;
    mobileLinks?: NavbarLink[];
    actions?: NavbarActionProps[];
    showNavigation?: boolean;
    customNavigation?: ReactNode;
    className?: string;
}

export default function Navbar({
    logo = "/images/logo-square.png",
    name = "CDL Insider",
    homeUrl = '/#',
    mobileLinks = [
        { text: "Stats", href: '/stats' },
        { text: "Players", href: '/players' },
        { text: "Teams", href: '/teams' },
    ],
    actions = [
        { text: "Stats", href: '/', isButton: true },
        { text: "Players", href: '/', isButton: true },
        { text: "Teams", href: '/', isButton: true }

        // {
        //   text: "Get Started",
        //   href: '#',
        //   isButton: true,
        //   variant: "default",
        // },
    ],
    showNavigation = true,
    customNavigation,
    className,
}: NavbarProps) {
    return (
        <header className={cn("fixed left-0 right-0 top-0 z-50 -mb-4 px-4 pb-4", className)}>
            {/* <div className="fade-bottom absolute left-0 h-18 w-full backdrop-blur-lg"></div> */}
            <div className="absolute left-0 h-18 w-full bg-gradient-to-b from-background from-20% to-transparent"></div>
            <div className="max-w-container relative mx-auto">
                <NavbarComponent>
                    <NavbarLeft>
                        <a
                            href={homeUrl}
                            className="flex items-center gap-2 text-xl font-bold"
                        >
                            <Image src={logo} width={75} height={75} alt={"CDL Insider Logo"} />
                            {/* {name} */}
                        </a>
                    </NavbarLeft>
                    <NavbarRight>
                        {actions.map((action, index) =>
                            action.isButton ? (
                                <Button
                                    key={index}
                                    variant={action.variant || "ghost"}
                                    className="hidden md:block hover:text-primary-foreground/90"
                                    asChild
                                >
                                    <a href={action.href}>
                                        {action.icon}
                                        {action.text}
                                        {action.iconRight}
                                    </a>
                                </Button>
                            ) : (
                                <a
                                    key={index}
                                    href={action.href}
                                    className="hidden text-sm md:block"
                                >
                                    {action.text}
                                </a>
                            ),
                        )}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 md:hidden"
                                >
                                    <Menu className="size-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <nav className="grid gap-6 text-lg font-medium">
                                    <a
                                        href={homeUrl}
                                        className="flex items-center gap-2 text-xl font-bold"
                                    >
                                        <span>{name}</span>
                                    </a>
                                    {mobileLinks.map((link, index) => (
                                        <Button asChild
                                            key={index}
                                            variant="ghost"
                                            className="justify-start"
                                        >
                                            <Link href={link.href}>
                                                {link.text}
                                            </Link>
                                        </Button>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </NavbarRight>
                </NavbarComponent>
            </div>
        </header>
    );
}
