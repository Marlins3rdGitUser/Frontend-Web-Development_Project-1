// Component list
// Section 1:
const buttonSecondarySection = document.querySelector("#buttonSecondaryList");
const primarySection = document.querySelector("#primaryList");
const secondarySection = document.querySelector("#secondaryList");
const itemListForm = document.querySelector("#itemListForm");
const inputName = document.querySelector("#itemName");
const inputCost = document.querySelector("#itemCost");
const inputWeight = document.querySelector("#itemWeight");
const itemAdd = document.querySelector("#itemAddButton");
const itemTableBody = document.querySelector("#itemTableBody");
const budgetInput = document.querySelector("#budgetInput");
const totalCostText = document.querySelector("#totalCostText");
const remainingText = document.querySelector("#remainingBudgetText")
const saveButton = document.querySelector("#saveButton")
const loadButton = document.querySelector("#loadButton")

// Section 2:
const buttonPrimarySection = document.querySelector("#buttonPrimaryList");
const removalTable = document.querySelector("#removalTable");
const removalTableBody = document.querySelector("#removalTableBody");
const tableMessage = document.querySelector("#message");
const overBudgetText = document.querySelector("#overBudgetText")
const noRemovalTable = document.querySelector("#noRemovalTable")
const noRemovalTableBody = document.querySelector("#noRemovalTableBody")
const midSection = document.querySelector("#midSection")
const topSection = document.querySelector("#topSection")

// When started, autohides.
secondarySection.hidden = true;
tableMessage.hidden = true;

// Section switcher. Simply hides the current section and shows the other one.
buttonSecondarySection.addEventListener("click", function () {
    primarySection.hidden = true;
    secondarySection.hidden = false;
    // Oh and it also calls this.
    determineItemsToRemove();
});
buttonPrimarySection.addEventListener("click", function () {
    secondarySection.hidden = true;
    primarySection.hidden = false;
    // And it does this. Read upahead for more!
    removalTableBody.innerHTML = ""
    noRemovalTableBody.innerHTML = ""
});

// Section 1 Scripts:
// Adding a new item to the list. Using one the workshop 4's exercise codes as a base.
itemListForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (inputName.value == "" || inputCost.value == "" || inputWeight.value == "") {
        alert("Make sure all three fields have something.");
    } else {
        // Create the elements.
        var table_Item = document.createElement("tr");
        var table_ItemName = document.createElement("td");
        var table_ItemCost = document.createElement("td");
        var table_ItemWeight = document.createElement("td");
        var table_deleteButton = document.createElement("td");
        //Give the elements values.
        table_ItemName.textContent = inputName.value;
        table_ItemCost.textContent = inputCost.value;
        table_ItemWeight.textContent = inputWeight.value;
        var buttonDelete = document.createElement("button");
        buttonDelete.textContent = "X";
        buttonDelete.classList = "removeItem";
        table_deleteButton.classList = "removeItemTD";
        // Append the elements and clear the inputs.
        table_deleteButton.append(buttonDelete);
        inputName.value = "";
        inputCost.value = "";
        inputWeight.value = "";
        itemTableBody.append(table_Item);
        table_Item.append(table_ItemName, table_ItemCost, table_ItemWeight, table_deleteButton);
        // Oh and add the remover button.
        buttonDelete.addEventListener("click", function () {
            table_Item.remove();
            calculateBudgets();
        });
        calculateBudgets();
    };
});

// Budget calculations... 
budgetInput.addEventListener("input", function () {
    calculateBudgets();
});

// AHEM... BUDGET CALCULATIONS.
function calculateBudgets(){
    // Set up total cost.
    var totalCost = 0; 
    // Get every row.
    var rows = itemTableBody.querySelectorAll("tr");
    // Check each row for it's cost and add it to the total cost
    rows.forEach(function (row) { 
        var cost = parseFloat(row.cells[1].textContent);
        totalCost += cost;
    }); 
    // Check if the budget is below 0 or NaN. If yes, then set it to 0.
    var budget = parseFloat(budgetInput.value);
    if (!isNaN(budget) || budget == 0) {
        var remaining = budget - totalCost;
    } else {
        var remaining = 0;
    }

    // Display the values.
    totalCostText.value = totalCost;
    remainingText.value = remaining;
}


// Saving functionality.
// You may notice that I remove the DELETE buttons entire.
// This is because copying them breaks them entirely and I do not understand how "event degledation" works and how it fixes it,
// so i will do this the way I understand it better.


saveButton.addEventListener("click", function() {
    // Reusing other objects and code is handy...
    noRemovalTableBody.innerHTML = "";
    noRemovalTableBody.innerHTML = itemTableBody.innerHTML;
    var rows = noRemovalTableBody.querySelectorAll("tr");
    rows.forEach(function(row){
        row.cells[3].remove();
    });
    localStorage.setItem(
        "savedTable", noRemovalTableBody.innerHTML
    );
    localStorage.setItem(
        "savedBudget", budgetInput.value
    );
    alert("Data saved.");
}); 
loadButton.addEventListener("click", function() {
    loadedTableData = localStorage.getItem("savedTable");
    if (loadedTableData === null){
        alert("No table data found.");
    } else {
        itemTableBody.innerHTML = loadedTableData; 
        var rows = itemTableBody.querySelectorAll("tr");
        rows.forEach(function(row){
            var table_deleterButton = document.createElement("td");
            var deleterButton = document.createElement("button");
            deleterButton.textContent = "X";
            deleterButton.classList = "removeItem";
            table_deleterButton.classList = "removeItemTD";
            table_deleterButton.append(deleterButton);
            row.append(table_deleterButton);
            deleterButton.addEventListener("click", function () {
                row.remove();
                calculateBudgets();
            });
        });
        loadedBudgetData = localStorage.getItem("savedBudget")
        if (loadedTableData === null) {} 
        else {
            budgetInput.value = loadedBudgetData;
        };
    };
    calculateBudgets();
});

// Section 2 Scripts:
// Checking the best items to remove.
function determineItemsToRemove() {
    // First, we check if we over the budget and that there is something in the list.
    if (remainingText.value < 0 && totalCostText > 0){
        // If we do, then we copy everything from the original table.
        noRemovalTableBody.innerHTML = itemTableBody.innerHTML;
        // then we remove all of the delete buttons, as they server no use.
        var rows = noRemovalTableBody.querySelectorAll("tr");
        rows.forEach(function(row){
            row.cells[3].remove();
        });
        var loopcount = 0;
        // Calculate the overbudget amount.
        var overbudget = parseFloat(remainingText.value) * -1;
        // And now we start the loop.
        while (overbudget > 0){
            //First we get all current rows from the hidden table
            var rows = noRemovalTableBody.querySelectorAll("tr");
            //We set up the ratio values and the empty variable.
            var highestRatio = 0;
            var highestRatioRow;
            // Now we check each row and compare them to the highest row ratio that we get.
            rows.forEach(function(row){
                // First, get cost and weight. Then divide cost with weight to get Cost per Weight ratio.
                var cost = parseFloat(row.cells[1].textContent);
                var weight = parseFloat(row.cells[2].textContent);
                var ratio = cost / weight;
                // If the current ratio is higher than the current highest ratio, then...
                if (ratio > highestRatio) {
                    // Set the highest ratio to the current one and save the current row as a variable.
                    highestRatio = ratio;
                    highestRatioRow = row;
                };
            })
            // once the all rows are checked, we proceed to get the cost of the row with highest ratio 
            // and deduct it from the overbudget.
            var deduction = parseFloat(highestRatioRow.cells[1].textContent);
            overbudget = overbudget - deduction;
            // After which we append the row from the hidden table to the removal table.
            removalTableBody.append(highestRatioRow);
            // Now the loop is complete and ready to repeat.
            loopcount = loopcount + 1;
            if (loopcount > 100)
            {
                break;
            };
        };
        // Show everything and hide the special message.
        overBudgetText.value = remainingText.value;
        removalTable.hidden = false;
        noRemovalTable.hidden = false;
        topSection.hidden = false;
        midSection.hidden = false;
        tableMessage.hidden = true;
    }
    else{
        // If we don't, we hide everything and just show a message.
        if (budgetInput.value <= 0) {
            if (budgetInput.value < 0) {
                tableMessage.textContent = "Comeback when you're little more... Richer."
            } else {
                tableMessage.textContent = "You need a budget to use this feature."                
            }
        }
        else if (totalCostText.value <= 0){
            if (totalCostText.value < 0) {
                tableMessage.textContent = "You are gaining money..? This isn't a profit tracker!";
            } else {
                tableMessage.textContent = "No cost, no budget managed.";      
            }
        } else if (remainingText.value >= 0) {
            if (remainingText.value = 0) {
                tableMessage.textContent = "Perfectly Zero. Just like nature intended."
            } else{
                tableMessage.textContent = "You are within the budget. No need to remove stuff."
            };
        } else {
            tableMessage.textContent = "Okay, something broke. :P";
        };

        removalTable.hidden = true;
        noRemovalTable.hidden = true;
        topSection.hidden = true;
        midSection.hidden = true;
        tableMessage.hidden = false;
    }
}


// So tired.
calculateBudgets();