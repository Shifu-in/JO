const MESSAGE = [
  {
    text: "To get started, click on the planet!",
    pass_criteria: (state) => { return state.score > 0 }
  },
  {
    text: "Keep on clicking and purchase your first upgrade!",
    pass_criteria: (state) => { return Object.values(state.upgrades).find((val) => val.level) }
  },
  {
    text: "Get that planet upgrade! (coming soon)",
    pass_criteria: (state) => false
  }
]

const CONSTANTS = {
  CURRENCY: "Energy",
  IMG_URL: {
    COOKIE: "https://raw.githubusercontent.com/JdyL/img-host/eb12be794f4871f010a76e82211fbdff4c8dea00/svg/space-clicker/cookie.svg",
    CURRENCY_ICON: "https://raw.githubusercontent.com/JdyL/img-host/028dac1b83c494af61ce617b44afe70d000f25ff/svg/space-clicker/energy.svg",
    STARS: "https://raw.githubusercontent.com/JdyL/img-host/25e95e7b28baed293f29217d803ed09b90fc96c1/svg/space-clicker/stars.svg"
  },
  COST_INCREMENTAL: 1.1
};

const DEFAULT_UPGRADES = {
  CLICK_MULTIPLIER: {
    displayName: "Click",
    description: "Multiply per click",
    baseMultiplier: 1,
    level: 0,
    requiredUpgrades: false,
    cost: 10,
    hasInterval: false,
    costIncrement: CONSTANTS.COST_INCREMENTAL * 1.3
  },
  AUTOCLICK: {
    displayName: "Auto-Click",
    description: "Automatically clicks",
    baseMultiplier: 0,
    level: 0,
    requiredUpgrades: false,
    cost: 50,
    hasInterval: true,
    costIncrement: CONSTANTS.COST_INCREMENTAL
  },
  VOYAGER: {
    displayName: "Voyager",
    description: "Automatically clicks more",
    baseMultiplier: 0,
    level: 0,
    requiredUpgrades: false,
    cost: 250,
    hasInterval: true,
    costIncrement: CONSTANTS.COST_INCREMENTAL * 1.1
  },
  ROVER: {
    displayName: "Rover",
    description: "Multiply all resources",
    baseMultiplier: 0,
    level: 0,
    requiredUpgrades: false,
    cost: 1000,
    hasInterval: true,
    costIncrement: CONSTANTS.COST_INCREMENTAL * 1.1,
    isResourceMultiplier: true
  },
  DELIVERY: {
    displayName: "Delivery",
    description: "Multiply all resources",
    baseMultiplier: 0,
    level: 0,
    requiredUpgrades: false,
    cost: 5000,
    hasInterval: true,
    costIncrement: CONSTANTS.COST_INCREMENTAL * 1.1,
    isResourceMultiplier: true
  },
  NEW_PLANET: {
    displayName: "New Planet",
    description: "Double all resources to collect",
    baseMultiplier: 0,
    level: 0,
    requiredUpgrades: false,
    cost: 1000000,
    hasInterval: true,
    costIncrement: CONSTANTS.COST_INCREMENTAL,
    unavailable: true,
    isResourceMultiplier: true
  }
};

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      upgrades: {
        ...DEFAULT_UPGRADES
      },
      time: 0,
      clickEffects: [],
      clickCounter: 0
    };
    this.onCookieClick = this.onCookieClick.bind(this);
  }

  componentDidMount() {
    setInterval(this.onUpdate, 1000);
  }

  onUpdate = () => {
    const { time } = this.state;
    const prevState = { ...this.state };
       
    const newState = { score: prevState.score + this.getRate(), time: prevState.time + 1 };
    // clear the dom components of click effects
    if (time % 10 === 0 && prevState.clickEffects?.length) {
      newState.clickEffects = [];
    }
    this.setState((prevState) => newState);
  };

  clickEffect = (value = 1) => {
    const milliseconds = Date.now();
    return (
      <div key={milliseconds} className="click-effect">
        +{value} {CONSTANTS.CURRENCY}
      </div>
    );
  };

  incrementScore = (val = 1) =>
    this.setState((prevState) => ({ score: prevState.score + val }));

  onCookieClick = () => {
    const { baseMultiplier } = this.state.upgrades.CLICK_MULTIPLIER;
    const newClickEffects = [this.clickEffect(baseMultiplier), ...this.state.clickEffects];
    this.setState((prevState) => ({
      clickEffects: newClickEffects,
      score: prevState.score + baseMultiplier,
      clickCounter: prevState.clickCounter + 1
    }));
  };

  cookie = () => {
    return (
      <div className="cookie" onClick={this.onCookieClick}>
        <img src={CONSTANTS.IMG_URL.COOKIE} />
      </div>
    );
  };
  
  onUpgradeClick = (type) => {
    return this.setState((prevState) => {
      const { baseMultiplier, level, cost, costIncrement, unavailable } = prevState.upgrades[type] || {};
      if (prevState.score < cost || unavailable) return false;
      return {
        score: prevState.score - cost,
        upgrades: {
          ...prevState.upgrades,
          [type]: {
            ...prevState.upgrades[type],
            baseMultiplier: baseMultiplier + 1,
            level: level + 1,
            cost: Math.floor(cost * costIncrement)
          }
        }
      };
    });
  };
  
  getRate = () => {
    let multiplier = 1;
    const base = Object.values(this.state.upgrades).reduce((acc, value) => {
      if (value.hasInterval && !value.isResourceMultiplier) {
        acc += value.baseMultiplier;
      }
      if (value.isResourceMultiplier) multiplier += (value.baseMultiplier);
      return acc;
    }, 0);
    return base * multiplier;
  };
  
  cantAfford = (cost) => {
    return this.state.score < cost;
  }

  render() {
    return (
      <div className="game-window">
        <div className="top-bar">
          <span>{CONSTANTS.CURRENCY}: {this.state.score}{" "}</span>
          <span className="game-message">{MESSAGE.find((val) => !val.pass_criteria(this.state))?.text || ''}</span>
        </div>
        <div className="game-screen">
          <div className="cookie-container">
            {this.cookie()}
            <div className="click-effect-container">
              {this.state.clickEffects.map((val) => val)}
            </div>
          </div>
          <div className="upgrades">
            <div className="info">
              Auto-rate: {this.getRate()} {CONSTANTS.CURRENCY}/sec
            </div>
            <div className="upgrade-list">
              {Object.entries(this.state.upgrades).map(([key, value]) => {
                return (
                  <div className={`upgrade ${this.state.score < value.cost ? "-disabled" : ''}`} onClick={() => this.onUpgradeClick(key)}>
                    <div className="upgrade-img"></div>
                    <div className="upgrade-info">
                      <h2>{value.displayName}</h2>
                      <ul>
                        <li>Lv. {value.level}</li>
                        <li className={`cost ${this.cantAfford(value.cost) ? '-disabled' : ''}`}>{value.cost}</li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="stars">
            <img src={CONSTANTS.IMG_URL.STARS} />
          </div>
        </div>
      </div>
    );
  }
}

const el = document.querySelector("#root");
ReactDOM.render(<Card title="Cookie Clicker" />, el);
