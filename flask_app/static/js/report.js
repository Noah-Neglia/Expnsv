
// This function only allows one dropdown element with the specified class to be open
function dropdown() { 
  $('.DescContainer').on('toggle', function() {
    
    // Only run if the dropdown is open
    if (!$(this).prop('open')) return;
    
    // Get all other open dropdowns and close them
    $('.DescContainer[open]').not(this).removeAttr('open');
    
  });
};

// Resizes a text area based on the amount of content currently inside of it
function textAreaResize() {
  $('.description').each(function() {
    $(this).css('height', 'auto');
    $(this).css('height', this.scrollHeight + 'px');
    if (this.scrollHeight > 255) {
      $(this).css('height', '255px');
    }
  });
}

// Dynamically resizes based on input
$(document).ready(function() {
  $('body').on('input', '.description',function() {
    $(this).css('height', 'auto');
    $(this).css('height', this.scrollHeight + 'px');
    if (this.scrollHeight > 255) {
      $(this).css('height', '255px');
      }
  });
});

// Updates the table with fresh data after ajax
function updateTable(data){
  console.log(data)
  console.log(data.dateRange.length)
  var tableResults = $('.table');
              tableResults.html(
                  '<thead>' +
                  '<tr>' +
                  '<th scope="col">Expense</th>' +
                  '<th scope="col">Cost</th>' +
                  '<th scope="col">Date</th>' +
                  '<th scope="col">Actions</th>' +
                  '</tr>' +
                  '</thead>'
              );
              $.each(data.dateRange, function(index, row) {
                  tableResults.append(
                      '<tbody>' +
                      '<tr>' +
                      '<td class="DescTd">' + row.name +
                      '<details class="DescContainer">' +
                      '<summary>See Description</summary>' +
                      '<p class="Description">' + row.description + '</p>' +
                      '</details>' +
                      '</td>' +
                      '<td>' + row.cost + '</td>' +
                      '<td>' + new Date(row.date).toLocaleString('en-US', {
                          timeZone: 'UTC',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                      }) + '</td>' +
                      `<td>
                      <form class="ExpenseIdForm">
                        <input type="hidden" name="expense_id" id="expense_id" value="${row.id}">

                         <input type="submit" value="Edit" class="text-success EditLink p-1"/>
                        |
                         <input type="submit" value="Delete" class="text-danger DeleteLink p-1"/>
                      </form>
                    </td>` +
                      '</tr>' +
                      '</tbody>'
                  );
              });
              
              // Displays an error message stating there were no expenses found in that range
              if(data.dateRange.length < 1){
                  $('.NoDataFound').css('display', 'block')
              // errors dissapear after set time
                setTimeout(() => {
                  $('.NoDataFound').css('display', 'none')
                }, 3000);
           
                // if there was no dateRange in the response set the cost sum and purchase count to zero
                $('.Results').html(
                  '<h3>Total Spent: $0.00' +
                  '<h3>Purchase Count: 0</h3>'
                );
              } else {
                // Otherwise set the sum and purchase count to the data retrieved from the range
              $('.Results').html(
                '<h3>Total Spent: $' + data.dateCost[0]['ROUND(SUM(cost), 2)'] + '</h3>' +
                '<h3>Purchase Count: ' + data.datePurchases[0]['COUNT(cost)'] + '</h3>'
              );
              }
          }



function dateVal(data){
     // if the errors array from the response contains "start_data" we display the error message in the element with id '.AlertName
    // every validation in this function follows this pattern
  if(data.errors.start_date){
    $('.AlertStartDate').css('display', 'block').html(
      `
      <p>${data.errors.start_date}</p>
      `
    )
  }
  if(data.errors.end_date){
    $('.AlertEndDate').css('display', 'block').html(
      `
      <p>${data.errors.end_date}</p>
      `
    )
  }
     setTimeout(() => {
       let classes = [$('.AlertStartDate'), $('.AlertEndDate')];
       for (let i = 0; i < classes.length; i++){
         $(classes[i]).hide()
       }
     }, 3000);

};


$(document).ready(function() {
  $('#DateForm').on('submit', async function(e) {
      e.preventDefault();
      var form = $(this);
      // Ajax request that handles creating a report by sending two dates to the route
       $.ajax({
          type: 'POST',
          url: '/create/report',
          data: form.serialize(),
          success: async function(data) {

            // if erros in the response, display the validation messages
           if('errors' in data){
           dateVal(data)
          
          } else{
            // Otherwise update the table with new data
            updateTable(data)
            // since the dropdown element has loaded into the DOM, call this function so it can be toggled
            dropdown();
            }
          }
      });
  });
});


$(document).ready(function() {
  $('body').on('click', '.EditLink', function() {
    // toggles the show class, which enables the element to be seen on the page
    $('.UpdateExpense').toggleClass('show');
  });

  $(document).click(function(event) { 
    if(!$(event.target).closest('.UpdateExpense').length && !$(event.target).is('.EditLink')) {
      // if we click away from the UpdateExpense element, we remove the class to make it hidden
      if($('.UpdateExpense').hasClass("show")) {
        $('.UpdateExpense').removeClass('show');
      }
    }        
  });
});

 // Hides the .UpdateExpense element, and reveals the UpdateSuccess element
 function UpdateSuccess() {
  $('.UpdateExpense').toggleClass('show');
  $(".UpdateSuccess").css('display', 'block')
  // Hides errors after the set time
  setTimeout(() => {
    $(".UpdateSuccess").css('display', 'none')
  }, 3000);
};

$(document).ready(function() {
  $('body').on('click', '.DeleteLink', function() {
    // toggles the show class, which enables the element to be seen on the page
    $('.DeleteExpense').toggleClass('show');
  });

  $(document).click(function(event) { 
    if(!$(event.target).closest('.DeleteExpense').length && !$(event.target).is('.DeleteLink')) {
      // if we click away from the DeleteExpense element, we remove the class to make it hidden
      if($('.DeleteExpense').hasClass("show")) {
        $('.DeleteExpense').removeClass('show');
      }
    }        
  });
});

// Hides the .DeleteExpense element, and reveals the DeleteSuccess element
function DeleteSuccess() {
  $('.DeleteExpense').toggleClass('show');
  $(".DeleteSuccess").css('display', 'block')
  // Hides errors after the set time
  setTimeout(() => {
    $(".DeleteSuccess").css('display', 'none')
  }, 3000);
};


  // simulating react state hook by wrapping the following functions in (document).ready
$(document).ready(function() {

  let expenseId = "";

// simulating react state hook by wrapping the following functions in (document).ready
$(document).ready( function getId() {
  $(document).on('submit', '.ExpenseIdForm', async function(e) {
    e.preventDefault();
    let form = $(this);
    //This Ajax request gets the id of one expense
    await $.ajax({
      type: 'POST',
      url: '/expense/id',
      data: form.serialize(),
      success: async function(data) {
      
        let id = data.expense_id;
        //  This Ajax request gets the data of the expense to be updated
          // this data fills the form values with data of the created expense
        await $.ajax({
          type: 'POST',
          url: `/one/expense/${id}`,
          data: form.serialize(),
          success: async function(expense) {

            const date = new Date(expense.one_expense[0].date);
            const formattedDate = date.toISOString().slice(0, 10);

              // Below we add values to the form inputs from the asscoiated expense from the DB
            
            
            $('#ExpenseName').html(
              
              `
              <label for="" class="form-label">Expense:</label>
              <input type="text" class="form-control" name="name" id="name" value="${expense.one_expense[0].name}">
              <div class="alert alert-danger AlertName" role="alert">
                                
              </div>
              ` 
            );
            $('#ExpenseCost').html(
      
              `
              <label for="" class="form-label">Cost:</label>
              <input type="number"  value="${expense.one_expense[0].cost}" min="0.00" max="10000.00" step="0.01" class="form-control" name="cost" id="cost"/>
              <div class="alert alert-danger AlertCost" role="alert">
                                
              </div>
              `
            );
            $('#ExpenseDate').html(
              
              `
              <label class="form-label" for="">Date:</label>
              <input type="date" class="form-check-date" name="date" id="date" value="${formattedDate}">
              <div class="alert alert-danger AlertDate" role="alert">
                                
              </div>
              `
            );
            $('#ExpenseDescription').html(
              
              `
              <label class="form-label" for="">Description:</label>
              <Textarea class="form-control description" name="description" id="description">${expense.one_expense[0].description}</Textarea>             
              <div class="alert alert-danger AlertDescription" role="alert">
                                
              </div>
              `
            );

            $('.DeleteExpense').html(
              
              `
              <h4>Are you sure you want to delete this expense?</h4>
              <button id="DeleteButton" class="btn btn-danger">Delete</button>
              `
            );

            $('.alert.alert-danger').hide()

          }
        });
         // Since the text area has not been loaded to the page, we call this fucntion so that
          // it will resize based on the current amount of input
        textAreaResize();
        expenseId = id;
      }
    });
  });
});



function updateVal(data){

  // if the errors array from the response contains "name" we display the error message in the element with id '.AlertName
    // every validation in this function follows this pattern
  if(data.errors.name){
    $('.AlertName').show().html(`
      <span>${data.errors.name}</span>
    `);
  }
 if(data.errors.cost){
    $('.AlertCost').show().html(
      `
      <p>${data.errors.cost}</p>
      `
    );
 };

 if(data.errors.date){
    $('.AlertDate').show().html(
      `
      <p>${data.errors.date}</p>
      `
    );
 };


 if(data.errors.description){
    $('.AlertDescription').show().html(
      `
      <p>${data.errors.description}</p>
      `
    );
 };

    // Remove errors after the set time
     setTimeout(() => {
       let classes = [$('.AlertName'), $('.AlertCost'), $('.AlertDate'), $('.AlertDescription')];
       for (let i = 0; i < classes.length; i++){
         $(classes[i]).hide()
       }
     }, 3000);

};


$(document).ready(function() {
  $('.UpdateForm').on('submit', async function(e) {
    e.preventDefault();
    var id = expenseId;
    let form = $(this);
     // This Ajax request takes the inputs from ".UpdateForm" and updates an expense
    await $.ajax({
      type: 'POST',
      url: `/update/expense/${id}`,
      data: form.serialize(),
      success: async function(data) {
        if ('errors' in data) {
          updateVal(data);
        } else {
           //UpdateSuccess displays a message that shows the update was successful
          UpdateSuccess();
          
          let form = $('#DateForm');
          // posts the date form with the start_date and _end_date
            await $.ajax({
              type: 'POST',
              url: '/create/report',
              data: form.serialize(),
              success: async function(data) {
                // if errors in the response display the validation messages
                if ('errors' in data) {
                  dateVal(data);
                } else {
                  // Update the table with new data
                  updateTable(data);
                  // the dropdown has not been loaded onto the page yet, we call this fucntion so that we
                  // can hide and show the individual dropdown menus
                  dropdown();
                }
              }
            });
          }
        }
      });
    });
  });


$(document).ready(function() {
  $('body').on('click', '#DeleteButton', async function(e) {
    e.preventDefault();
    var id = expenseId;
    // deletes the esxpense at the given id
    await $.ajax({
      url: `/delete/expense/${id}`,
      success: async function(data) {
        DeleteSuccess();
        let form = $('#DateForm');
        // Dynamically creates another of the same report so that we can see the data after the deletion
          await $.ajax({
            type: 'POST',
            url: '/create/report',
            data: form.serialize(),
            success: async function(data) {
              console.log(data)
              updateTable(data);
               // the dropdown has not been loaded onto the page yet, we call this fucntion so that we
                  // can hide and show the individual dropdown menus
              dropdown();
            }
          });
      }
    });
  });
});
});

     
    
      