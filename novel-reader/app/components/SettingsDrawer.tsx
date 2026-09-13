'use client';

import { useEffect } from 'react';
import type { ReaderSettings } from '../lib/types';
import { defaultSettings } from '../lib/storage';

type Props = { open: boolean; onClose: () => void; value: ReaderSettings; onChange: (value: ReaderSettings) => void };

const themes: Array<[ReaderSettings['theme'], string]> = [['sepia','กระดาษ (แนะนำ)'],['light','สว่าง'],['dark','หมึกดำ'],['oled','OLED'],['moonlight','แสงจันทร์'],['forest','พงไพร']];

export default function SettingsDrawer({ open, onClose, value, onChange }: Props) {
  useEffect(() => {
    document.documentElement.dataset.theme = value.theme;
    document.documentElement.style.setProperty('--reader-size', `${value.fontSize}px`);
    return () => {};
  }, [value]);
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === 'Escape' && open) onClose(); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [open, onClose]);
  const update = <K extends keyof ReaderSettings>(key: K, next: ReaderSettings[K]) => onChange({ ...value, [key]: next });
  return (
    <aside className={`settings-drawer ${open ? 'open' : ''}`} aria-hidden={!open} aria-label="ตั้งค่าการอ่าน">
      <div className="drawer-head"><div><p className="eyebrow">ปรับแต่ง</p><h2>การอ่าน</h2></div><button type="button" onClick={onClose} aria-label="ปิดการตั้งค่า">×</button></div>
      <label>รูปแบบตัวอักษร<select value={value.font} onChange={(event) => update('font', event.target.value as ReaderSettings['font'])}><option value="sans">สารบรรณ</option><option value="noto">Noto Sans Thai</option><option value="serif">ปรีดี / ตัวมีเชิง</option></select></label>
      <label>ขนาดตัวอักษร <output>{value.fontSize}px</output><input type="range" min="16" max="32" value={value.fontSize} onChange={(event) => update('fontSize', Number(event.target.value))} /></label>
      <SettingButtons label="ระยะห่างบรรทัด" options={[[1.5,'1.5×'],[1.85,'1.85×'],[2.2,'2.2×']]} value={value.lineHeight} onPick={(next) => update('lineHeight', next as ReaderSettings['lineHeight'])} />
      <SettingButtons label="ความกว้างหน้ากระดาษ" options={[["narrow",'แคบ'],["standard",'มาตรฐาน'],["wide",'กว้าง']]} value={value.width} onPick={(next) => update('width', next as ReaderSettings['width'])} />
      <SettingButtons label="การจัดข้อความ" options={[["left",'ชิดซ้าย'],["justify",'เต็มบรรทัด']]} value={value.align} onPick={(next) => update('align', next as ReaderSettings['align'])} />
      <SettingButtons label="ระยะห่างตัวอักษร" options={[["normal",'ปกติ'],["comfortable",'สบาย'],["airy",'โปร่ง']]} value={value.spacing} onPick={(next) => update('spacing', next as ReaderSettings['spacing'])} />
      <div className="toggle-list"><label><input type="checkbox" checked={value.showChapterArt} onChange={(event) => update('showChapterArt', event.target.checked)} /> แสดงภาพเปิดตอน</label><label><input type="checkbox" checked={value.readingRuler} onChange={(event) => update('readingRuler', event.target.checked)} /> Reading Ruler</label><label><input type="checkbox" checked={value.breakReminder} onChange={(event) => update('breakReminder', event.target.checked)} /> เตือนพักสายตา 20 นาที</label></div>
      <div className="theme-grid" aria-label="ธีมสี">{themes.map(([id,label]) => <button type="button" className={value.theme === id ? 'active' : ''} key={id} data-swatch={id} onClick={() => update('theme', id)}>{label}</button>)}</div>
      <button className="reset-button" type="button" onClick={() => onChange(defaultSettings)}>คืนค่าเริ่มต้น</button>
    </aside>
  );
}

function SettingButtons({ label, options, value, onPick }: { label: string; options: Array<[string | number,string]>; value: string | number; onPick: (value:string | number) => void }) {
  return <fieldset><legend>{label}</legend><div className="segmented">{options.map(([id,label]) => <button type="button" className={value === id ? 'active' : ''} key={id} onClick={() => onPick(id)}>{label}</button>)}</div></fieldset>;
}
