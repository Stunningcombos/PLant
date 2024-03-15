document.addEventListener("DOMContentLoaded", function() {
  const catMeatElement = document.getElementById("cookie");
  const catMeatCountElement = document.getElementById("cookie-count");
  const changeImageButton = document.getElementById("changeImageButton");
  const chaosButton = document.getElementById("chaos");
  const upgrades = document.getElementById('upgrades');

  let catMeat = 0;
  let autoClickerInterval;
  let autoClickerRate = 0;
  let chaosAnimation;
  let posX;
  let posY;
  let directionX = 1;
  let directionY = 1;

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

        const catImage = catMeatElement.querySelector('.popCat');
        const catImageWidth = catImage.offsetWidth;
        const catImageHeight = catImage.offsetHeight;
        posX = (window.innerWidth - catImageWidth) / 2;
        posY = (window.innerHeight - catImageHeight) / 2;
        catImage.style.left = posX + 'px';
        catImage.style.top = posY + 'px';
      })
      .catch(error => {
        console.error("Error fetching cat image:", error);
      });
  }

  changeImageButton.addEventListener('click', fetchCatImage);

  function animateChaos() {
    const catImage = catMeatElement.querySelector('.popCat');
    const catImageWidth = catImage.offsetWidth;
    const catImageHeight = catImage.offsetHeight;

    posX += directionX * 5;
    posY += directionY * 5;

    if (posX <= 0 || posX >= window.innerWidth - catImageWidth) {
      directionX = -directionX;
    }
    if (posY <= 0 || posY >= window.innerHeight - catImageHeight) {
      directionY = -directionY;
    }

    catImage.style.left = posX + 'px';
    catImage.style.top = posY + 'px';

    chaosAnimation = requestAnimationFrame(animateChaos);
  }

  function addChaos() {
    if (!chaosAnimation) {
      posX = window.innerWidth / 2;
      posY = window.innerHeight / 2;
      animateChaos();
    }
  }

  chaosButton.addEventListener('click', addChaos);

  const allUpgrades = [];

  function createUpgradeButton(upgrade) {
    const button = document.createElement('button');
    button.textContent = `${upgrade.name} - Cost: ${upgrade.cost}`;
    button.addEventListener('click', () => {
      if (catMeat >= upgrade.cost) {
        catMeat -= upgrade.cost;
        upgrade.cost *= 2;
        upgrade.effect();
        catMeatCountElement.textContent = `${catMeat} cat meat`;
        button.textContent = `${upgrade.name} - Cost: ${upgrade.cost}`;
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
    baseRate: 1,
    rateMultiplier: 2,
    level: 0,
    get cost() {
      return this.baseCost * Math.pow(this.rateMultiplier, this.level);
    },
    effect: function() {
      if (!autoClickerInterval) {
        autoClickerInterval = setInterval(() => {
          catMeat += autoClickerRate;
          catMeatCountElement.textContent = `${catMeat} cat meat`;
        }, 1000);
      }
      autoClickerRate += autoClickUpgrade.baseRate * Math.pow(autoClickUpgrade.rateMultiplier, autoClickUpgrade.level);
      autoClickUpgrade.level++;
    }
  };

  allUpgrades.push(clickUpgrade, autoClickUpgrade);

  allUpgrades.forEach(upgrade => {
    createUpgradeButton(upgrade);
  });
});