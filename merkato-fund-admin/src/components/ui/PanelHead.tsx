export function PanelHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return <div className="panel-head"><h2>{title}</h2>{action && <button onClick={onAction}>{action} →</button>}</div>
}