const http = require("http");
const { Builder, By, Key, until } = require("selenium-webdriver");

async function inspec() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("https://bincheck.io/");
    await driver
      .findElement(By.id("bin"))
      .sendKeys("4453158382913313", Key.RETURN);
    //await driver.findElement(By.css(".btn-primary")).click();
    const resp = await driver.findElements(By.css(".w-full"));
    let response = [];
    for (let Key of resp) {
      let a = await Key.getText();
      await response.push(`${a}\n`);
    }
    console.log(response.toString());
    await driver.takeScreenshot().then((image, err) => {
      require("fs").writeFileSync("img.png", image, { encoding: "utf8" });
    });
    return await response;
  } finally {
    driver.quit();
    console.log("finish");
  }
}
async function main(req, res) {
  console.log("init");
  const spect = await inspec();
  await res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  await res.end(`<div>
  
  <h3>${spect.toString()}</h3>
  
  </div>`);
}

http
  .createServer((req, res) => {
    if (req.url === "/inspec") {
      main(req, res);
    }
  })
  .listen(3290, () => {
    console.log("Funcionando en puerto 3290");
  });
