
$( document ).ready(function() {

   $("#file").on("change", function(e) {

		// when file is uploaded, grab it
		var selectedFile = e.target.files[0];

		var reader = new FileReader();

		reader.onload = function(e) {
			// process result of the read
		  var text = reader.result;
		  var parsedFile = CSVToArray( text );

		  // now generate table
		  $("#upload-modal").modal();

		  var dropdownHtml = `
				<th>
                    <select index='%i%' class='form-control'>
                        <option value='invald' >-- select --</option>
                        <option value='full_name' >Full Name</option>
                        <option value='first_name' >First Name</option>
                        <option value='last_name' >Last Name</option>
                        <option value='student_id' >Student ID</option>
                        <option value='email' >Email</option>
                    </select>
				</th>
		  `;

		  for(var i = 0; i < parsedFile.length; i++) {

		  	var newRow = "<tr>";
		  	var rowSize = 0;

		  	for(var j = 0; j < parsedFile[i].length; j++) {
		  		rowSize += parsedFile[i][j].length;
				  newRow += ("<td>" + parsedFile[i][j] + "</td>");
				  if (i == 0) {
					  $("#upload-modal .table thead").append(dropdownHtml.replace('%i%', j));
				  }
			  }

			  newRow += "</tr>";

				if (rowSize > 0) { // skip empty rows
			  	$("#upload-modal .table").append(newRow);
				}

		  }

		}

		// process async above
		reader.readAsText(selectedFile);
		// console.log(CSVToArray(reader.readAsText(selectedFile)));

	});

});

// http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
// yay cargo cult programming
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];
        }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

function uploadSubmit() {

    // validate

    // get array of selections
    var headings = $("#upload-modal select").map(function(){return $(this).val();}).get();
    console.log(headings);

    var full_split_name_error = headings.includes("full_name") && (headings.includes("first_name") || headings.includes("first_name"));
    var missing_student_id = !headings.includes("student_id");
    var missing_email = !headings.includes("email");
    var any_missing = headings.includes("invalid");
    var first_name_wo_last_name = headings.includes("first_name") && !headings.includes("last_name");
    var last_name_wo_first_name = headings.includes("last_name") && !headings.includes("first_name");

    if (full_split_name_error || missing_student_id || missing_email || first_name_wo_last_name || last_name_wo_first_name || any_missing) {
        if ($("#csv-upload-error").hasClass('hidden')) {
            $("#csv-upload-error").removeClass( "hidden" );
        } else {
            $("#csv-upload-error").effect( "shake" );
        }
    } else {
        $("#csv-upload-error").addClass( "hidden" );
        // valid - g2g

        // pull data from our psuedo-form into the hidden elements before posting
        // might be better to put this in a little json hash instead
        $("#csv-header-map-hidden-field").val(headings.join(','));
        $("#csv-header-toggle-hidden-field").checked = $("#first-row-is-header").is(':checked');


        $("#roster-upload-form").submit();
    }
}

function headerToggle(caller) {
    var checked = $(caller).is(':checked');
    if (checked) {
        $("#upload-modal table tr:first-child").addClass("disabled");
    } else {
        $("#upload-modal table tr:first-child").removeClass("disabled");
    }
}
