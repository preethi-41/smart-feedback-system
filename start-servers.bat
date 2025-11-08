@echo off
start "Backend Server" powershell -NoExit "cd c:\Users\chsri\smart_feedback_analysis_tcs\backend && npm start"
start "Frontend Server" powershell -NoExit "cd c:\Users\chsri\smart_feedback_analysis_tcs\frontend && npm start"
timeout /t 10
start http://localhost:5000
start http://localhost:3000
