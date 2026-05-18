#!/usr/bin/env python3
"""Generate all game assets automatically (except music — add your own to assets/audio/music/)."""
import math
import os
import struct
import wave
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, 'assets')


def write_png(path, w, h, fill_fn):
    """Write RGBA PNG using only stdlib."""
    raw = bytearray()
    for y in range(h):
        raw.append(0)
        for x in range(w):
            r, g, b, a = fill_fn(x, y, w, h)
            raw.extend((r, g, b, a))

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    ihdr = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw), 9)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        f.write(png)


def grad(x, y, w, h, c1, c2):
    t = (x / max(w - 1, 1) + y / max(h - 1, 1)) * 0.5
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)) + (255,)


def circle(x, y, cx, cy, r):
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r


def write_wav(path, duration=0.15, freq=440, volume=0.3):
    sr = 22050
    n = int(sr * duration)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, 'w') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        for i in range(n):
            t = i / sr
            env = min(1.0, (n - i) / (sr * 0.05)) * min(1.0, i / (sr * 0.01))
            val = int(32767 * volume * env * math.sin(2 * math.pi * freq * t))
            w.writeframes(struct.pack('<h', val))


def gen_backgrounds():
    specs = [
        ('menu_bg.png', (400, 300), lambda x, y, w, h: grad(x, y, w, h, (10, 14, 26), (26, 16, 64))),
        ('school_exterior.png', (512, 256), lambda x, y, w, h: grad(x, y, w, h, (30, 40, 60), (60, 80, 100))),
        ('school_hallway.png', (512, 256), lambda x, y, w, h: (
            (40, 44, 58, 255) if (x // 32 + y // 32) % 2 == 0 else (34, 38, 50, 255))),
        ('classroom.png', (256, 256), lambda x, y, w, h: (
            (30, 36, 48, 255) if y > h * 0.7 else (50, 60, 75, 255))),
        ('cafeteria.png', (256, 256), lambda x, y, w, h: grad(x, y, w, h, (50, 35, 28), (70, 50, 40))),
        ('lab.png', (256, 256), lambda x, y, w, h: grad(x, y, w, h, (20, 35, 45), (30, 55, 65))),
    ]
    for name, (w, h), fn in specs:
        write_png(os.path.join(ASSETS, 'images', 'backgrounds', name), w, h, fn)


def gen_ui():
    def panel(x, y, w, h):
        if x < 4 or y < 4 or x >= w - 4 or y >= h - 4:
            return (0, 245, 255, 180)
        return (10, 20, 40, 200)

    write_png(os.path.join(ASSETS, 'images', 'ui', 'panel.png'), 128, 128, panel)
    write_png(os.path.join(ASSETS, 'images', 'ui', 'button.png'), 160, 48, lambda x, y, w, h: (
        (0, 245, 255, 60) if y > h // 2 else (255, 45, 149, 50)))
    write_png(os.path.join(ASSETS, 'images', 'ui', 'minimap_frame.png'), 180, 140, lambda x, y, w, h: (
        (0, 245, 255, 255) if x < 2 or y < 2 or x >= w - 2 or y >= h - 2 else (10, 16, 32, 220)))
    write_png(os.path.join(ASSETS, 'images', 'ui', 'dialogue_box.png'), 320, 80, lambda x, y, w, h: (
        (10, 20, 40, 230) if 8 < x < w - 8 and 8 < y < h - 8 else (0, 245, 255, 120)))


def gen_npc():
    colors = [
        ('student_01.png', (255, 136, 170)),
        ('student_02.png', (136, 204, 255)),
        ('student_03.png', (136, 255, 170)),
        ('teacher_01.png', (255, 215, 0)),
        ('teacher_02.png', (204, 136, 255)),
    ]
    for name, col in colors:
        def fn(x, y, w, h, c=col):
            cx, cy, r = w // 2, h // 2 + 5, min(w, h) // 3
            if circle(x, y, cx, cy, r):
                return c + (255,)
            if circle(x, y, cx, cy + r + 8, r + 6):
                return (c[0] // 2, c[1] // 2, c[2] // 2, 255)
            return (0, 0, 0, 0)
        write_png(os.path.join(ASSETS, 'images', 'npc', name), 48, 56, fn)


def gen_items():
    items = {
        'student_id.png': ((200, 200, 220), (0, 245, 255)),
        'phone.png': ((40, 40, 50), (100, 200, 255)),
        'bag.png': ((120, 80, 50), (160, 110, 70)),
        'keys.png': ((255, 215, 0), (200, 170, 0)),
        'notebook.png': ((240, 230, 200), (100, 150, 200)),
        'lunch_box.png': ((255, 150, 80), (255, 200, 100)),
        'glasses.png': ((80, 80, 90), (150, 200, 255)),
        'memory_crystal.png': ((180, 68, 255), (255, 100, 200)),
    }
    for name, (c1, c2) in items.items():
        write_png(os.path.join(ASSETS, 'images', 'items', name), 32, 32,
                  lambda x, y, w, h, a=c1, b=c2: grad(x, y, w, h, a, b))


def gen_effects():
    write_png(os.path.join(ASSETS, 'images', 'effects', 'glow.png'), 64, 64, lambda x, y, w, h: (
        (0, 245, 255, int(180 * max(0, 1 - math.hypot(x - w/2, y - h/2) / (w/2))))))
    write_png(os.path.join(ASSETS, 'images', 'effects', 'sparkle.png'), 32, 32, lambda x, y, w, h: (
        (255, 255, 200, 255) if abs(x - w//2) < 2 or abs(y - h//2) < 2 else (0, 0, 0, 0)))
    write_png(os.path.join(ASSETS, 'images', 'effects', 'echo_aura.png'), 48, 48, lambda x, y, w, h: (
        (178, 77, 255, int(120 * max(0, 1 - math.hypot(x - w/2, y - h/2) / (w/2))))))


def gen_icons():
    for i, color in enumerate([(0, 245, 255), (255, 45, 149), (255, 215, 0), (136, 255, 170)]):
        write_png(os.path.join(ASSETS, 'icons', f'icon_{i+1}.png'), 32, 32, lambda x, y, w, h, c=color: (
            c + (255,) if circle(x, y, w//2, h//2, 12) else (0, 0, 0, 0)))
    write_png(os.path.join(ASSETS, 'icons', 'favicon.png'), 32, 32, lambda x, y, w, h: grad(x, y, w, h, (0, 245, 255), (255, 45, 149)))


def gen_fonts_info():
    p = os.path.join(ASSETS, 'fonts', 'README.txt')
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write('Fonts: game uses Google Fonts (Orbitron, Rajdhani) via CDN in index.html.\n')
        f.write('Optional: place custom .woff2 files here.\n')


def gen_sfx():
    sfx = [
        ('pickup.wav', 880, 0.12),
        ('interact.wav', 440, 0.1),
        ('quest_complete.wav', 523, 0.2),
        ('level_up.wav', 659, 0.25),
        ('echo.wav', 330, 0.3),
        ('footstep.wav', 200, 0.05),
        ('ui_open.wav', 550, 0.08),
        ('ui_close.wav', 400, 0.08),
    ]
    for name, freq, dur in sfx:
        write_wav(os.path.join(ASSETS, 'audio', 'sfx', name), dur, freq)


def gen_music_readme():
    p = os.path.join(ASSETS, 'audio', 'music', 'README.txt')
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write('MUSIC FOLDER — add your own files here\n')
        f.write('=====================================\n\n')
        f.write('Supported formats: .mp3, .ogg, .wav\n\n')
        f.write('Suggested tracks:\n')
        f.write('  - ambient_school.mp3   (loop, main gameplay)\n')
        f.write('  - menu_theme.mp3       (main menu)\n')
        f.write('  - quest_success.mp3    (optional sting)\n\n')
        f.write('The game uses procedural Web Audio until files are wired in.\n')


def main():
    print('Generating assets...')
    gen_backgrounds()
    gen_ui()
    gen_npc()
    gen_items()
    gen_effects()
    gen_icons()
    gen_fonts_info()
    gen_sfx()
    gen_music_readme()
    print('Done! Assets saved to:', ASSETS)
    print('Music: add your files to assets/audio/music/')


if __name__ == '__main__':
    main()
