var balanceElement = document.getElementById("balance");
var countElement = document.getElementById("count");

var countUpOptions = {
    separator: " "
};

var count = new CountUp(countElement, 0.00022793, 0.0101595600, 13, 1, countUpOptions);

document.getElementById("startButton").addEventListener("click", function() {
    count.start(function() {
        var newBalance = parseFloat(balanceElement.textContent) + parseFloat(count.endVal);
        balanceElement.textContent = newBalance.toFixed(8);
    });
});
