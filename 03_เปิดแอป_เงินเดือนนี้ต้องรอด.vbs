' เปิดเว็บ "เงินเดือนนี้ต้องรอด" แบบไร้จอดำ CMD (Silent Launch)
Set objFSO = CreateObject("Scripting.FileSystemObject")
strDir = objFSO.GetParentFolderName(WScript.ScriptFullName)
strHtml = strDir & "\03_เงินเดือนนี้ต้องรอด\index.html"

Set objShell = CreateObject("WScript.Shell")
objShell.Run """" & strHtml & """", 1, False
