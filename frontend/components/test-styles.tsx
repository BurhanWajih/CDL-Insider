export default function TestStyles() {
  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold text-white">Style Test Component</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-red-500 p-4 text-white">Red Background</div>
        <div className="rounded-lg bg-blue-500 p-4 text-white">Blue Background</div>
        <div className="rounded-lg bg-green-500 p-4 text-white">Green Background</div>
        <div className="rounded-lg bg-yellow-500 p-4 text-white">Yellow Background</div>
        <div className="rounded-lg bg-orange-500 p-4 text-white">Orange Background</div>
        <div className="rounded-lg bg-zinc-800 p-4 text-white">Zinc Background</div>
      </div>
    </div>
  )
}
