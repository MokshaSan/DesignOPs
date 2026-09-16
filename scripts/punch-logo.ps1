Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class LogoPunch {
  public static void Run(string src, string dest, bool lighten) {
    using (var srcBmp = new Bitmap(src))
    using (var bmp = new Bitmap(srcBmp.Width, srcBmp.Height, PixelFormat.Format32bppArgb)) {
      using (var g = Graphics.FromImage(bmp)) {
        g.DrawImage(srcBmp, 0, 0, srcBmp.Width, srcBmp.Height);
      }
      var rect = new Rectangle(0, 0, bmp.Width, bmp.Height);
      var data = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
      int bytes = Math.Abs(data.Stride) * bmp.Height;
      byte[] px = new byte[bytes];
      Marshal.Copy(data.Scan0, px, 0, bytes);
      int w = bmp.Width;
      int stride = data.Stride;
      for (int y = 0; y < bmp.Height; y++) {
        int row = y * stride;
        for (int x = 0; x < w; x++) {
          int i = row + x * 4;
          byte b = px[i], gch = px[i + 1], r = px[i + 2];
          if (r < 26 && gch < 26 && b < 26) {
            px[i + 3] = 0;
            continue;
          }
          if (lighten && x > w * 0.26) {
            double luma = 0.2126 * r + 0.7152 * gch + 0.0722 * b;
            if (luma > 8 && luma < 100) {
              px[i + 2] = (byte)Math.Min(255, r * 2.5 + 118);
              px[i + 1] = (byte)Math.Min(255, gch * 2.3 + 132);
              px[i] = (byte)Math.Min(255, b * 2.1 + 150);
            }
          }
        }
      }
      Marshal.Copy(px, 0, data.Scan0, bytes);
      bmp.UnlockBits(data);
      bmp.Save(dest, ImageFormat.Png);
    }
  }
}
"@

$src = "C:\Users\perer\OneDrive\Documents\GitHub\DesignOPs\public\brand\nestura-lockup.png"
$light = "C:\Users\perer\OneDrive\Documents\GitHub\DesignOPs\public\brand\nestura-lockup-light.png"
$dark = "C:\Users\perer\OneDrive\Documents\GitHub\DesignOPs\public\brand\nestura-lockup-on-dark.png"
[LogoPunch]::Run($src, $light, $false)
[LogoPunch]::Run($src, $dark, $true)
Write-Output "wrote lockups"
