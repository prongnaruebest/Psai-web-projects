Set WshShell = CreateObject("WScript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run """" & strPath & "\18_เว็บติดตามอนิเมะและมังงะ\index.html""", 1, False
