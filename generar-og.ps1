Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::new(1200, 630)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
function Brush([string]$color) { [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($color)) }
function PenColor([string]$color, [float]$width) { [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml($color), $width) }
function Rounded([float]$x,[float]$y,[float]$w,[float]$h,[float]$r) {
 $p=[System.Drawing.Drawing2D.GraphicsPath]::new(); $d=$r*2
 $p.AddArc($x,$y,$d,$d,180,90); $p.AddArc($x+$w-$d,$y,$d,$d,270,90); $p.AddArc($x+$w-$d,$y+$h-$d,$d,$d,0,90); $p.AddArc($x,$y+$h-$d,$d,$d,90,90); $p.CloseFigure(); return $p
}
$rect=[System.Drawing.Rectangle]::new(0,0,1200,630)
$bg=[System.Drawing.Drawing2D.LinearGradientBrush]::new($rect,[System.Drawing.ColorTranslator]::FromHtml('#10141c'),[System.Drawing.ColorTranslator]::FromHtml('#1d1716'),35)
$g.FillRectangle($bg,$rect)
$grid=PenColor '#252b36' 1
for($x=0;$x -le 1200;$x+=60){$g.DrawLine($grid,$x,0,$x,630)}
for($y=0;$y -le 630;$y+=60){$g.DrawLine($grid,0,$y,1200,$y)}
$orange=Brush '#ff7a1a';$white=Brush '#f2f4f8';$muted=Brush '#a4adbb';$dim=Brush '#778293';$dark=Brush '#11151d'
$g.FillRectangle($orange,0,0,1200,7)
$g.FillPath($orange,(Rounded 72 66 72 72 16))
$g.FillPath($dark,(Rounded 84 104 14 21 2));$g.FillPath($dark,(Rounded 102 84 14 41 2));$g.FillPath($dark,(Rounded 120 99 14 26 2))
$fSmall=[System.Drawing.Font]::new('Arial',15,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
$fLabel=[System.Drawing.Font]::new('Arial',18,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
$fTitle=[System.Drawing.Font]::new('Arial',82,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
$fSub=[System.Drawing.Font]::new('Arial',27,[System.Drawing.FontStyle]::Regular,[System.Drawing.GraphicsUnit]::Pixel)
$fCard=[System.Drawing.Font]::new('Arial',25,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString('COUNTER-STRIKE 2  /  COMUNIDAD', $fSmall,$muted,164,91)
$g.DrawString('RANKING', $fTitle,$white,68,191)
$g.DrawString('OBF', $fTitle,$orange,68,282)
$g.DrawString('Estadísticas, perfiles y divisiones', $fSub,$muted,74,407)
$g.FillRectangle((Brush '#303846'),74,478,500,2)
$g.DrawString('COMPITE. MEJORA. SUBE.', $fLabel,$white,74,507)
$g.DrawString('nomfps.github.io', $fSmall,$dim,74,568)
$shadow=Brush '#10141b';$panel=Brush '#1b212c';$line=PenColor '#394353' 2
$g.FillPath($shadow,(Rounded 667 100 452 443 24));$g.FillPath($panel,(Rounded 657 90 452 443 24));$g.DrawPath($line,(Rounded 657 90 452 443 24))
$g.DrawString('PERFIL DE JUGADOR', $fSmall,$dim,692,122)
$g.FillPath((Brush '#27313f'),(Rounded 692 165 74 74 18))
$g.FillEllipse((Brush '#6f7d90'),716,178,26,26)
$g.FillPath((Brush '#6f7d90'),(Rounded 708 207 42 19 9))
$g.FillPath((Brush '#364253'),(Rounded 788 174 212 13 6));$g.FillPath((Brush '#303a49'),(Rounded 788 201 146 10 5))
$g.FillRectangle((Brush '#303a49'),692,270,382,2)
$labels=@('IMPACTO','PUNTERIA','EQUIPO');$lengths=@(292,220,260)
for($i=0;$i -lt 3;$i++){ $yy=300+$i*57;$g.DrawString($labels[$i],$fSmall,$muted,692,$yy);$g.FillPath((Brush '#303a49'),(Rounded 820 ($yy+5) 230 9 4));$g.FillPath($orange,(Rounded 820 ($yy+5) ([Math]::Round($lengths[$i]*0.65)) 9 4)) }
$g.FillPath((Brush '#33271f'),(Rounded 692 477 160 30 8));$g.DrawString('ESTADISTICAS', $fSmall,$orange,704,484)
$g.DrawString('CS2', $fCard,$white,1016,478)
$bmp.Save((Join-Path $PSScriptRoot 'og-image.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose();$bmp.Dispose()
