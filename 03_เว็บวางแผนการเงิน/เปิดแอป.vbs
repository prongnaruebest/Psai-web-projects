' เปิดเว็บ "เดือนนี้ต้องรอด" แบบไร้จอดำ CMD
Set objFSO = CreateObject("Scripting.FileSystemObject")
strDir = objFSO.GetParentFolderName(WScript.ScriptFullName)
strHtml = strDir & "\index.html"

Set objShell = CreateObject("WScript.Shell")
objShell.Run """" & strHtml & """", 1, False
