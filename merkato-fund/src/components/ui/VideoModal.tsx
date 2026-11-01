import { Icon } from './Icon'
import { useLanguage } from '../../lib/useLanguage'

export function VideoModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage()
  return <div className="modal" role="dialog" aria-modal="true" aria-label={t('Video preview')}>
    <button className="modal-close" onClick={onClose} aria-label={t('Close video')}><Icon name="x"/></button>
    <div className="video-placeholder"><Icon name="play" size={50}/><h3>{t('YouTube playback placeholder')}</h3><p>{t('Connect an official Merkato Fund YouTube embed URL here when verified.')}</p></div>
  </div>
}