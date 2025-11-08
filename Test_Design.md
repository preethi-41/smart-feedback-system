# Test Design Document

- Test Case #: TC01
- Test Step #: 1
- Application/Screen: Feedback Submission Page
- Test Case: Verify feedback submission and sentiment analysis
- Expected Result from the model: Sentiment (Positive/Negative/Neutral) returned; HTTP 201; record persisted
- Pre-Requisites: Backend at http://localhost:5000; Frontend at http://127.0.0.1:5500/feedback.html
- Input provided to the model: "The service was excellent!"
- Iteration # NN: 1
- Cross-Validation Method: Check POST /api/feedback response and GET /api/summary counts
- Actual result: Sentiment returned as "Positive"
- Defect [Y/N]: N

---

- Test Case #: TC02
- Test Step #: 1
- Application/Screen: Feedback Submission Page
- Test Case: Validate negative classification
- Expected Result from the model: Sentiment Negative (score ≤ -0.3)
- Pre-Requisites: Backend running; Frontend accessible
- Input provided to the model: "This was terrible, the worst."
- Iteration # NN: 1
- Cross-Validation Method: Response label + /api/summary negative count increments
- Actual result: Negative
- Defect [Y/N]: N

---

- Test Case #: TC03
- Test Step #: 1
- Application/Screen: Feedback Submission Page
- Test Case: Handle gibberish/short input as neutral
- Expected Result from the model: Neutral (score = 0)
- Pre-Requisites: Backend running
- Input provided to the model: "@@@"
- Iteration # NN: 1
- Cross-Validation Method: Response label + summary not skewed
- Actual result: Neutral
- Defect [Y/N]: N

---

- Test Case #: TC04
- Test Step #: 1
- Application/Screen: Summary Dashboard
- Test Case: Event filter updates KPIs and charts
- Expected Result from the model: UI aligns with /api/summary?event=<event>
- Pre-Requisites: Existing data for event
- Input provided to the model: Select Event=Workshop
- Iteration # NN: 1
- Cross-Validation Method: Compare UI values to API JSON
- Actual result: Matches
- Defect [Y/N]: N
