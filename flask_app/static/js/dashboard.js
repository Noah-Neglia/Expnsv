// When validations appear, this function removes them after the set time
$(document).ready(function() { 
  setTimeout(() => {
    let classes = $(".alert.alert-danger");
    for (let i = 0; i < classes.length; i++){
      $(classes[i]).css("display", 'none');
    }
  }, 3000);
});

$(document).ready(function() { 
  setTimeout(() => {
    let classes = $(".alert.alert-success");
    for (let i = 0; i < classes.length; i++){
      $(classes[i]).css("display", 'none');
    }
  }, 3000);
});

// This function only allows one dropdown element with the specified class to be open
$(document).ready(function() { 
  $('.DescContainer').on('toggle', function(event) {
    
    // Only run if the dropdown is open
    if (!$(this).prop('open')) return;
    
    // Get all other open dropdowns and close them
    $('.DescContainer[open]').not(this).removeAttr('open');
    
  });
});

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

  


  $(document).ready(function() {
    $('.EditLink').click(function() {
      // toggles the show class, which enables the element to be seen on the page
      $('.UpdateExpense').toggleClass('show');
    });
  
    $(document).click(function(event) { 
      // if we click away from the UpdateExpense element, we remove the class to make it hidden
      if(!$(event.target).closest('.UpdateExpense').length && !$(event.target).is('.EditLink')) {
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

  };

  $(document).ready(function() {
    $('.DeleteLink').click(function() {
      // toggles the show class, which enables the element to be seen on the page
      $('.DeleteExpense').toggleClass('show');
    });
  
    $(document).click(function(event) { 
      // if we click away from the DeleteExpense element, we remove the class to make it hidden
      if(!$(event.target).closest('.DeleteExpense').length && !$(event.target).is('.DeleteLink')) {
        if($('.DeleteExpense').hasClass("show")) {
          $('.DeleteExpense').removeClass('show');
        }
      }        
    });
  });

    // Hides the .DeleteExpense element, and reveals the .DeleteSuccess element
  function DeleteSuccess() {
    $('.DeleteExpense').toggleClass('show');
    $(".DeleteSuccess").css('display', 'block')
  };

  

  // simulating react state hook by wrapping the following functions in (document).ready
  $(document).ready(function() {

    let expenseId = "";
  

  $(document).ready( function getId() {
    $('.ExpenseIdForm').on('submit', async function(e) {
      e.preventDefault();
      let form = $(this);
      //This Ajax request gets the id of one expense
      await $.ajax({
        type: 'POST',
        url: '/expense/id',
        data: form.serialize(),
        success: async function(data) {
        
          let id = data.expense_id;
          // This Ajax request gets the data of the expense to be updated
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

  //  Remove these validations from the page after the set time
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
          if('errors' in data){
            updateVal(data)
          
          } else{
          //UpdateSuccess displays a message that shows the update was successful
          UpdateSuccess();
          // redirect to the dashboard after the set time, this allows UpdateSuccess to be displayed
          setTimeout(() => {
            window.location.href = '/dashboard'; // redirect to the dashboard page
          }, 3000);
   
        }
          
        },
        // error: function(error) {
        //   console.log(error);
        // }
      });
    });
  });
  
  $(document).ready(function() {
    $('body').on('click', '#DeleteButton', async function(e) {
      e.preventDefault();
      var id = expenseId;
      // Deletes an expense at the given id
      await $.ajax({
        url: `/delete/expense/${id}`,
        success: async function(data) {
          //DeleteSuccess displays a message that shows the delete was successful
          DeleteSuccess();
          // redirect to the dashboard after the set time, this allows DeleteSuccess to be displayed
          setTimeout(() => {
            window.location.href = '/dashboard'; // redirect to the dashboard page
          }, 3000);
        },
        error: function(error) {
          console.log(error);
        }
      });
    });
  });
  
  
});