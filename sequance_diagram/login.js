
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sequence Diagram Login</title>

    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #ffffff;
            margin: 30px;
        }

        h2 {
            text-align: center;
        }

        .diagram {
            display: flex;
            justify-content: center;
            margin-top: 30px;
            overflow-x: auto;
        }
    </style>
</head>

<body>

    <h2>Sequence Diagram Login</h2>

    <div class="diagram">
        <pre class="mermaid">
sequenceDiagram
    actor User
    participant Account
    participant Database

    User->>Account: 1. Login()
    activate Account

    Account->>Database: 2. CariUserLogin()
    activate Database

    Database-->>Account: 3. Return User Data
    deactivate Database

    Account->>Account: 4. Check()

    Account-->>User: 5. Menampilkan Data / PesanError
    deactivate Account
        </pre>
    </div>

    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: "default",
            sequence: {
                showSequenceNumbers: false,
                actorMargin: 80,
                messageMargin: 40
            }
        });
    </script>

</body>
</html>
