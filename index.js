const fs = require('fs');
const superagent = require('superagent');

// Solution 1 - Callbacks (Callback Hell, Triangle shape)
/*
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) return console.log(err.message);
      console.log(res.body.message);

      fs.writeFile('dog-img.txt', res.body.message, err => {
        if (err) return console.log(err.message);
        console.log('Random dog image saved to file');
      });
    });
});*/

// Solution 2 - Promises (Consume)
/*
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`) // Returns a promise
    // Promise fullfilled
    .then(res => {
      console.log(res.body.message);

      fs.writeFile('dog-img.txt', res.body.message, err => {
        if (err) return console.log(err.message);
        console.log('Random dog image saved to file');
      });
    })
    // Rejected promise
    .catch(err => {
      console.log(err.message);
    });
});*/

// Solution 3 - Promise (Consume, Superagent) and Promisify fs.ReadFile and fs.writeFile

const readFilePro = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('Could not read the file 😒.');
      return resolve(data);
    });
  });
};
const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) reject('Could not write to file 😒.');
      return resolve();
    });
  });
};
/*
readFilePro(`${__dirname}/dog.txt`)
  .then(data => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then(res => {
    console.log(res.body.message);
    return writeFilePro(`${__dirname}/dog-img.txt`, res.body.message);
  })
  .then(() => {
    console.log('Random dog image saved to file');
  })
  .catch(err => {
    console.log(err);
  });
*/

// Solution 4 ASYNC/AWAIT (ES8) .. SYNTHETIC SUGAR for Promises
/*
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePro(`${__dirname}/dog-img.txt`, res.body.message);
    console.log('Random dog image saved to file');
  } catch (error) {
    console.log(error);
    throw error;
  }
  return '2: READY 🐶';
};
*/
/* Pattern 1
console.log('1: Will get dog pics');
getDogPic()
  .then(x => {
    console.log(x);
    console.log('3: Done getting dog pics!!');
  })
  .catch(err => {
    console.log('ERROR 🤯🤯');
  });
*/
/*
// Pattern 2
//IIFE
(async () => {
  try {
    console.log('1: Will get dog pics');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dog pics!!');
  } catch (err) {
    console.log('ERROR 🤯🤯');
  }
})();*/

// Parallel ASYNC/AWAIT (ES8) .. SYNTHETIC SUGAR for Promises

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1Pro = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res2Pro = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res3Pro = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map(el => {
      return el.body.message;
    });
    console.log(imgs);

    await writeFilePro(`${__dirname}/dog-img.txt`, imgs.join('\n'));
    console.log('Random dog image saved to file');
  } catch (error) {
    console.log(error);
    throw error;
  }
  return '2: READY 🐶';
};

(async () => {
  try {
    console.log('1: Will get dog pics');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dog pics!!');
  } catch (err) {
    console.log('ERROR 🤯🤯');
  }
})();
