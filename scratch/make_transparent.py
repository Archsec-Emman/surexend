from PIL import Image

src_path = r"C:\Users\ASAKE ISLAMIA SALAH\.gemini\antigravity\brain\8051af0f-e7a7-4fd5-9942-cebb889a6899\.user_uploaded\media_1786094243185.png"
dst_path = r"C:\Users\ASAKE ISLAMIA SALAH\.gemini\antigravity\scratch\surexend\public\logo-mark-gold.png"

img = Image.open(src_path).convert("RGBA")
datas = img.getdata()

newData = []
for item in datas:
    r, g, b, a = item
    # If the pixel is near white (background)
    if r > 220 and g > 220 and b > 220:
        # Make transparent
        # Calculate anti-aliased transparency near edges
        avg = (r + g + b) / 3.0
        if avg > 245:
            newData.append((255, 255, 255, 0))
        else:
            alpha = int((255 - avg) / (255 - 220) * 255)
            newData.append((r, g, b, max(0, min(255, alpha))))
    else:
        newData.append(item)

img.putdata(newData)

# Trim transparent padding around the logo mark
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

img.save(dst_path, "PNG")
print("Saved transparent gold logo mark to:", dst_path)
