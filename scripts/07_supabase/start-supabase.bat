@echo off
echo Deteniendo Supabase...
call supabase stop

echo.
echo Iniciando Supabase...
call supabase start

pause
