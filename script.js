document.addEventListener("DOMContentLoaded", function() {
  const catMeatElement = document.getElementById("cookie");
  const catMeatCountElement = document.getElementById("cookie-count");
  const changeImageButton = document.getElementById("changeImageButton");
  const upgrades = document.getElementById('upgrades');

  let catMeat = 0;
  let autoClickerInterval;
  let autoClickerRate = 0; // Track the current rate of auto-clicker

  catMeatElement.addEventListener('click', () => {
    catMeat++;
    catMeatCountElement.textContent = `${catMeat} cat meat`;
  });

  function fetchCatImage() {
    const apiKey = "live_xKAOdxkf6LBC7y3J6iGeRha6b3YOm8ELeBf0dREP3hsuxbCii3d5zsallAwBLsYh";
    const apiUrl = "https://api.thecatapi.com/v1/images/search";

    fetch(apiUrl, {
      headers: {
        "x-api-key": apiKey
      }
    })
      .then(response => response.json())
      .then(data => {
        const catImageUrl = data[0].url;
        catMeatElement.innerHTML = `<img class="popCat" src="${catImageUrl}">`;
      })
      .catch(error => {
        console.error("Error fetching cat image:", error);
      });
  }

  changeImageButton.addEventListener('click', fetchCatImage);

  const allUpgrades = [];

  function createUpgradeButton(upgrade) {
    const button = document.createElement('button');
    button.textContent = `${upgrade.name} - Cost: ${upgrade.cost}`; // Corrected here
    button.addEventListener('click', () => {
      if (catMeat >= upgrade.cost) {
        catMeat -= upgrade.cost;
        upgrade.cost *= 2;
        upgrade.effect();
        catMeatCountElement.textContent = `${catMeat} cat meat`;
        button.textContent = `${upgrade.name} - Cost: ${upgrade.cost}`; // Corrected here
      } else {
        alert('Not enough cat meat to purchase this upgrade!');
      }
    });
    upgrades.appendChild(button);
    upgrade.button = button;
  }

  const clickUpgrade = {
    name: "Clicker",
    cost: 10,
    effect: function() {
      catMeatElement.addEventListener('click', () => {
        catMeat += 2;
        catMeatCountElement.textContent = `${catMeat} cat meat`;
      });
    }
  };

  const autoClickUpgrade = {
    name: "Auto Clicker",
    baseCost: 50,
    baseRate: 1, // Initial rate of auto-clicker
    rateMultiplier: 2, // Rate multiplier for exponential increase
    level: 0, // Track the level of auto-clicker upgrade
    get cost() { // Changed to a getter function
      return this.baseCost * Math.pow(this.rateMultiplier, this.level);
    },
    effect: function() {
      if (!autoClickerInterval) {
        autoClickerInterval = setInterval(() => {
          catMeat += autoClickerRate; // Add cat meat based on the current rate
          catMeatCountElement.textContent = `${catMeat} cat meat`;
        }, 1000);
      }
      autoClickerRate += autoClickUpgrade.baseRate * Math.pow(autoClickUpgrade.rateMultiplier, autoClickUpgrade.level); // Increase rate for next upgrade
      autoClickUpgrade.level++; // Increase the level of auto-clicker upgrade
    }
  };

  allUpgrades.push(clickUpgrade, autoClickUpgrade);

  allUpgrades.forEach(upgrade => {
    createUpgradeButton(upgrade);
  });
});
