' เปิดหน้าศูนย์รวมเว็บแอปพลิเคชันแบบไร้จอดำ CMD (Silent Launch)
Set objFSO = CreateObject("Scripting.FileSystemObject")
strDir = objFSO.GetParentFolderName(WScript.ScriptFullName)
strHtml = strDir & "\00_ศูนย์รวมเว็บแอปพลิเคชัน.html"

Set objShell = CreateObject("WScript.Shell")
objShell.Run """" & strHtml & """", 1, False
