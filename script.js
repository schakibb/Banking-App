"use strict";
const account1 = {
  name: "Chakib Haddadi",
  movement: [600, 400, -350, 150, -200, 1500, -90, -30, 90],
  password: 1111,
};

const account2 = {
  name: "Alice Smith",
  movement: [800, -200, 300, -600, 1000, -250, 700, -100],
  password: 2222,
};

const account3 = {
  name: "Bob Johnson",
  movement: [1200, -500, 600, -200, 700, -300, 400],
  password: 3333,
};

const account4 = {
  name: "Emma Davis",
  movement: [400, -100, 200, -300, 500, -200, 300, -100],
  password: 4444,
};

const account = [account1, account2, account3, account4];
console.log(account);

const btnLogInOut = document.querySelector(".Btn-log-in-out");
const overlay = document.querySelector(".overlay");
const logInForme = document.querySelector(".log-in-out-form");
const inputUsername = document.querySelector(".username");
const inputPassword = document.querySelector(".password");
const submit = document.querySelector(".submit");
const mainApp = document.querySelector(".main-app");
const labelLogInOut = document.querySelector(".label-log-in-out");
const logoutConfirmation = document.querySelector(
  ".logout-confirmation-window"
);
const confirmLogoutYes = document.querySelector(".confirmLogout-yes");
const confirmLogoutNO = document.querySelector(".confirmLogout-no");
const welcomeMsg = document.querySelector(".welcome-msg");
const movements = document.querySelector(".movements");
const balanceValue = document.querySelector(".balance-value");
const summaryValueIn = document.querySelector(".summary__value--in");
const summaryValueOut = document.querySelector(".summary__value--out");
const btnLoan = document.querySelector(".form__btn--loan");
const loanAmountValue = document.querySelector(".loan-amount-value");
const btnTransfer = document.querySelector(".form__btn--transfer");
const transferAmountValue = document.querySelector(".transfer-amount-value");
const transferAmountTo = document.querySelector(".transfer-amount-to");
const sortingBtn = document.querySelector(".sort");

let currentUser;

function open() {
  if (mainApp.classList.contains("hidden"))
    logInForme.classList.remove("hidden");
  else logoutConfirmation.classList.remove("hidden");

  overlay.classList.remove("hidden");
}

function close() {
  if (logInForme.classList.contains("hidden"))
    logoutConfirmation.classList.add("hidden");
  else logInForme.classList.add("hidden");

  overlay.classList.add("hidden");
}

function displayMovements(acc,sorto=false) {
  const movs = sorto ? acc.movement.slice().sort((a, b) => a - b) : acc.movement;
  movements.innerHTML = "";
  movs.forEach((element, index) => {
    let html = `
    <div class="movements__row">
      <div class="movements__type movements-type-${element > 0 ? "deposit" : "withdrawal"}">
        ${index + 1} ${element > 0 ? "deposit" : "withdrawal"}
      </div>
      <div class="movements__value">${Math.abs(element)}$</div>
    </div>`;
    movements.insertAdjacentHTML("afterbegin", html);
  });
}


function displayBalanceAndSummary(acc) {
  balanceValue.textContent = `${acc.movement.reduce(
    (total, cur) => total + cur,
    0
  )}$`;
  summaryValueIn.textContent = `${acc.movement
    .filter((mov) => mov > 0)
    .reduce((total, cur) => total + cur, 0)}$`;
  summaryValueOut.textContent = `${Math.abs(
    acc.movement.filter((mov) => mov < 0).reduce((total, cur) => total + cur, 0)
  )}$`;
}

function updateUi() {
  displayBalanceAndSummary(currentUser, true);
  displayMovements(currentUser);
}

function transferAmount() {
  // Retrieve values from input fields
  const transferTo = transferAmountTo.value.trim();
  const transferValue = Number(transferAmountValue.value.trim());

  // Validate input values
  if (!transferTo || !transferValue || transferValue <= 0) {
    alert("Please enter valid recipient and transfer amount.");
    return;
  }

  // Find recipient account
  const recipientAccount = account.find((acc) => acc.name === transferTo);

  if (!recipientAccount) {
    alert("Recipient account not found.");
    return;
  }

  // Check if sender has sufficient balance
  const senderBalance = currentUser.movement.reduce(
    (total, cur) => total + cur,
    0
  );
  if (transferValue > senderBalance) {
    alert("Insufficient balance for the transfer.");
    return;
  }

  // Perform the transfer
  recipientAccount.movement.push(transferValue);
  currentUser.movement.push(-transferValue);

  // Update UI
  updateUi();

  // Clear input fields
  transferAmountTo.value = "";
  transferAmountValue.value = "";

  alert("Transfer successful!");
}

function loanAmount() {
  // Retrieve loan amount from input field
  const loanAmount = Number(loanAmountValue.value.trim());

  // Validate loan amount
  if (!loanAmount || loanAmount <= 0) {
    alert("Please enter a valid loan amount.");
    return;
  }

  // Push loan amount to currentUser's movement array
  currentUser.movement.push(loanAmount);

  // Clear loan amount input field
  loanAmountValue.value = "";

  // Update UI
  updateUi();

  // Inform user about successful loan request
  alert("Loan request successful!");
}

function logIn() {
  close();
  btnLogInOut.style.backgroundColor = "rgb(255, 65, 65)";
  labelLogInOut.textContent = "Logout";
  mainApp.classList.remove("hidden");
  welcomeMsg.textContent = `Welcome back ,${currentUser.name.split(" ")[0]}`;
  updateUi();
}

function logOut() {
  close();
  btnLogInOut.style.backgroundColor = "#03C03C";
  labelLogInOut.textContent = "Login";
  mainApp.classList.add("hidden");
  welcomeMsg.textContent = "Login To Get Started";
  currentUser = "";
}

function sortMovements() {
  displayMovements(currentUser, true);
}

overlay.addEventListener("click", close);

confirmLogoutYes.addEventListener("click", () => {
  close();
  btnLogInOut.style.backgroundColor = "#03C03C";
  labelLogInOut.textContent = "Login";
  mainApp.classList.add("hidden");
  welcomeMsg.textContent = "Login To Get Started";
  currentUser = "";
});

confirmLogoutNO.addEventListener("click", close);

btnLogInOut.addEventListener("click", open);

submit.addEventListener("click", function (event) {
  event.preventDefault();
  currentUser = account.find(
    (acc) =>
      inputUsername.value === acc.name &&
      acc.password === Number(inputPassword.value)
  );
  if (currentUser) {
    logIn();
  } else {
    alert(
      "User does not exist.\n\nPlease check the log for the list of accounts or use the following credentials:\nUsername: Chakib Haddadi\nPassword: 1111"
    );
  }
  inputPassword.value = inputUsername.value = "";
});

btnLoan.addEventListener("click", function (event) {
  event.preventDefault();
  loanAmount();
});

btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();
  transferAmount();
});

sortingBtn.addEventListener("click", sortMovements);

// btnLoan.addEventListener("click", function (event) {
//   event.preventDefault();
//   currentUser.movement.push(Number(loanAmountValue.value));
//   loanAmountValue.value = "";
//   displayBalanceAndSummary(currentUser);
//   displayMovements(currentUser);
//   displayConsole();
// });

// btnTransfer.addEventListener("click", function (event) {
//   event.preventDefault();
//   let resever = account.find((acc) => acc.name === transferAmountTo.value);
//   let amountvalue = Number(transferAmountValue.value);

//   if (resever) {
//     if (amountvalue>0) {
//       if(amountvalue>resever.movement.reduce((total,cur)=>total+cur,0))
//       {
//           resever.movement.push(amountvalue)
//           currentUser.movement.push(-amountvalue)
//           displayBalanceAndSummary(currentUser)
//           displayMovements(currentUser)
//           displayConsole()
//       }else{
//         alert("dadadad")
//       }
//     }else{
//       alert("Transfer unseccesfull ❌(negative value)")
//     }
//   } else {
//     alert("User does exist");
//   }
//   transferAmountTo.value=''
//   transferAmountValue.value=''
// });

const displayConsole = function () {
  account.forEach((item, index) => {
    console.log(`\n---------- Account ${index + 1} ----------`);
    console.log(`Name:      ${item.name}`);
    console.log(`Password:  ${item.password}`);
    console.log(`Movements: ${item.movement.join(", ")}`);
  });
};

// const displayMovements=function(acc)
// {
//  acc.movement.forEach(element => {
//   console.log(element);
//  });
// }
// displayMovements(account1)

// overlay.classList.remove("hidden});

// // submit.addEventListener('click', function() {
// //   if (inputUsername.value === 'ch' && inputPassword.value === '1111') {
// //     close();
// //     mainApp.classList.remove('hidden');
// //   } else {
// //     alert('Wrong credentials');
// //   }
// // });
// // let a=function(){
// submit.addEventListener("click", function (event) {
//   event.preventDefault();
//   if (inputUsername.value === "ch" && inputPassword.value === "1111") {
//     close();
//     btnLogInOut.style.backgroundColor = "rgb(255, 65, 65)";
//     labelLogInOut.textContent = "Logout";
//     mainApp.classList.remove("hidden");
//   } else {
//     alert("User dont exist");
//     inputPassword.value = inputUsername.value = "";
//   }
// });

// btnLogInOut.addEventListener("click", function () {
//   if (mainApp.classList.contains("hidden")) {
//     open();
//   } else {
//     logoutConfirmation.classList.remove("hidden");
//   }
//   overlay.classList.remove("hidden");
// });
