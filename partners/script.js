document.addEventListener('DOMContentLoaded', function() {
    var balanceElement = document.getElementById("balance");
    var balance = 0;
    var subscribedChannels = new Set();

    document.querySelectorAll('.subscribe-button').forEach(function(button) {
        button.addEventListener('click', function() {
            var channel = button.getAttribute('data-channel');
            if (!subscribedChannels.has(channel)) {
                subscribedChannels.add(channel);
                balance += 10000;
                balanceElement.textContent = balance;
                window.open(button.previousElementSibling.querySelector('a').href, '_blank');
            } else {
                alert("Вы уже подписались на этот канал и получили награду.");
            }
        });
    });
});
