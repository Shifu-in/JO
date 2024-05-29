document.addEventListener('DOMContentLoaded', function() {
    var balanceElement = document.getElementById("balance");
    var countElement = document.getElementById("count");
    var daysElement = document.getElementById("daysUntilLaunch");

    var balance = 0;
    var miningRates = {
        hour: 2 / 3600,  // 2 YNG per hour
        day: 30 / 86400, // 30 YNG per day
        week: 280 / 604800 // 280 YNG per week
    };

    var totalMiningRate = miningRates.hour + miningRates.day + miningRates.week;

    function updateBalance() {
        balance += totalMiningRate * 0.5; // Update every 0.5 seconds
        balanceElement.textContent = balance.toFixed(8);
        countElement.textContent = balance.toFixed(10);
    }

    function updateDaysUntilLaunch() {
        var days = parseInt(daysElement.textContent, 10);
        if (days > 0) {
            days -= 1;
            daysElement.textContent = days;
        }
    }

    document.getElementById("startButton").addEventListener("click", function() {
        setInterval(updateBalance, 500);
        setInterval(updateDaysUntilLaunch, 86400000); // Update every 24 hours (86400000 ms)
    });
});
