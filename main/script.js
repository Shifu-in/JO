document.addEventListener('DOMContentLoaded', function() {
    var balanceElement = document.getElementById("balance");
    var countElement = document.getElementById("count");

    var balance = 0;
    var miningRates = {
        hour: 2 / 3600,  // 2 YNG per hour
        day: 30 / 86400, // 30 YNG per day
        week: 280 / 604800 // 280 YNG per week
    };

    var totalMiningRate = miningRates.hour + miningRates.day + miningRates.week;

    function updateBalance() {
        balance += totalMiningRate * 4; // Update every 4 seconds
        balanceElement.textContent = balance.toFixed(8);
        countElement.textContent = balance.toFixed(10);
    }

    document.getElementById("startButton").addEventListener("click", function() {
        setInterval(updateBalance, 4000);
    });
});
