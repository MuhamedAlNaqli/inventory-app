$p = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:GH_PAT)); 
git push "https://x-access-token:$p@github.com/MuhamedAlNaqli/inventory-app.git" main:main --force; 
Remove-Variable p;