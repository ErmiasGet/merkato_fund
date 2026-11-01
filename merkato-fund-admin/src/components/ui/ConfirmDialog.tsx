import { Button } from './Button'

export function ConfirmDialog({ title, text, close, confirm }: { title: string; text: string; close: () => void; confirm: () => void }) {
  const isPublish = title.includes('Publish')

  return <div className="dialog-layer"><button className="dialog-scrim" onClick={close} aria-label="Close confirmation" /><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <span>!</span><h2 id="dialog-title">{title}</h2><p>{text}</p>
    <div><Button onClick={close}>Cancel</Button><Button kind={isPublish ? 'primary' : 'danger'} onClick={confirm}>{isPublish ? 'Confirm & publish' : 'Delete'}</Button></div>
  </section></div>
}