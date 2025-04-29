export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-[#F5E8C2]/50 mb-4 text-4xl">📝</div>
      <h3 className="text-lg font-medium text-[#F5E8C2]">No tasks yet</h3>
      <p className="text-sm text-[#F5E8C2]/70 mt-1 max-w-xs">
        Click the + button to add your first task and start being productive
      </p>
    </div>
  )
}
