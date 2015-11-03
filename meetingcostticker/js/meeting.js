jQuery.fn.exists = function(){return this.length>0;}

var ticks = 0;
var cost = 0;
var workHoursPerWeek = 40;
var interval; 
var vacationInDays = 16; // (incl. national  holidays)
var employeeCostFactor = 2;

var roles = [{uid: getUniqueId(), name: "Senior Manager", salary: 150000, number: 0},
    {uid: getUniqueId(), name: "Project Manager", salary: 103000, number: 0},
    {uid: getUniqueId(), name: "Product Manager", salary: 101000, number: 0},
    {uid: getUniqueId(), name: "Software Developer", salary: 83000, number: 0},
    {uid: getUniqueId(), name: "Web Developer", salary: 65000, number: 0},
    {uid: getUniqueId(), name: "Administrator", salary: 73000, number: 0},
    {uid: getUniqueId(), name: "QA Specialist", salary: 58000, number: 0},
    {uid: getUniqueId(), name: "Technical Support", salary: 54000, number: 0}];
function emptyRole() {
    return emptyRoleWithId(getUniqueId());
}

function emptyRoleWithId(uid) {
    return {uid: uid, name: "", salary: 0, number: 0};
}

function fillWithZero(num) {
    return num < 10 ? '0' + num : '' + num
}

function timeStr(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);

    return fillWithZero(h) + ":" + fillWithZero(m) + ":" + fillWithZero(s)
}

function costStr(cost) {
    return Globalize.format(cost, 'c');
}

function update_result() {
    $("#time").html(timeStr(ticks))
    $("#cost").html(costStr(cost));
}

function costPerSecond() {
    var totalCost = 0;

    for (i in roles) {
        var workHoursPerDay = workHoursPerWeek / 5;
        var workDays = 52 * 5 - vacationInDays;
        var workSeconds = workDays * workHoursPerDay * 60 * 60;

        var salaryPerSecond = roles[i].salary / workSeconds;
        var costPerSecond = salaryPerSecond * employeeCostFactor;

        totalCost += roles[i].number * costPerSecond;
    }

    return totalCost;
}

function tick() {
    ticks++;
    cost += costPerSecond();
    update_result();
}

function start() {
   $("#start").hide();
   $("#pause").show();
   $("#reset").show();
   $("#result").show()
   $("#help").hide()
   interval = setInterval(tick, 1000);
   update_result();
}

function pause() {
   $("#start").button('option', 'label', 'Resume').show();
   $("#pause").hide();
   $("#reset").show();
   clearInterval(interval);
}

function reset() {
    if (confirm('Are you sure you want to reset the timer?')) { 
       $("#start").button('option', 'label', 'Start').show();
       $("#pause").hide();
       $("#reset").hide();
       $("#result").hide();
       $("#help").show();
       ticks = 0;
       cost = 0;
       clearInterval(interval);               
    }
}

function saveAttendanceNumbersToModel(e, ui) {
    // I'm lazy, just sync every number instead of selecting the one that changed
    for (i in roles) {
        var role = roles[i];  
        role.number = $('#' + getHtmlId(role, 'number')).spinner('value');
    }
}

function uidExists(uid) {
    for (i in roles) {
        if (roles[i].uid == uid) {
            return true;
        }
    }
    return false;
}

function saveConfigurationToModel() {
    // delete non-existing roles
    roles = $.grep(roles, function(role) {
        return $('#' + getHtmlId(role, 'role')).exists();
    });

    // add new roles
    $('#configuration_roles > tbody > tr').each(function () {
        var uid = $(this).attr('id').split('_')[1];

        if (!uidExists(uid)) {
            roles.push(emptyRoleWithId(uid));
        }
    });

    // save role values
    for (i in roles) {
        var role = roles[i];                    

        role.salary = $('#' + getHtmlId(role, 'salary')).spinner('value');
        role.name = $('#' + getHtmlId(role, 'name')).val();// must be the last because we use the name as identifier
    }

    // all other values
    workHoursPerWeek = $("#workHoursPerWeek").spinner('value');
    vacationInDays = $("#vacationInDays").spinner('value');
    employeeCostFactor = $("#employeeCostFactor").spinner('value');
}

function configurationChanged() {
    saveConfigurationToModel();

    // need to reinitialize parts of the ui
    initAttendance();
    initDialog();
}

function getUniqueId() {
    var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}

function getHtmlId(role, attr) {
    return attr + '_' + role.uid;
}

function initDialogRole(role) {
    $("#configuration_roles").append('<tr id="' + getHtmlId(role, 'role') + '">\
        <td><input id="' + getHtmlId(role, 'name') +'" value="' + role.name + '" /></td>\
        <td><input id="' + getHtmlId(role, 'salary') +'" value="' + role.salary + '" /></td>\
        <td><button style="font-size: .7em !important" id="' + getHtmlId(role, 'delete') + '">Delete</button></td>\
        </tr>');

    $("#" + getHtmlId(role, 'delete')).button({
        icons: { primary: "ui-icon-circle-minus" },
        text: false
    }).click(function() {
        $(this).parents('tr').remove();
    });

    $("#" + getHtmlId(role, 'salary')).spinner({
        min: 0,
        step: 1000,
        culture: 'en-US',
        numberFormat: "C"
    }); 
}

function initDialog() {
    // somewhat dirty: state is kept in the dom until the user clicks on apply ... but it works!

    $("#configuration").dialog({
        height: 'auto',
        width: 600,
        modal: true,
        autoOpen: false,
        buttons: {
            Cancel: function () {
                $(this).dialog("close");
            },
            Apply: function () {
                configurationChanged();
                $(this).dialog("close");
            }
        }
    });

    // cleardown to allow reinitializing
    $("#configuration_roles").html('');

    for (i in roles) {
        initDialogRole(roles[i]);
    }

    $("#add_role").button({
        icons: { primary: "ui-icon-circle-plus" },
        text: true
    }).unbind().click(function() {
        role = emptyRole();
        initDialogRole(role);
        $('#' + getHtmlId(role, 'name')).focus();
    });  

    $("#workHoursPerWeek").spinner({}).val(workHoursPerWeek);
    $("#vacationInDays").spinner({}).val(vacationInDays);
    $("#employeeCostFactor").spinner({
        step: 0.1
    }).val(employeeCostFactor);             
}

function initAttendance() {
    $("#attendance_roles").html('');

    for (i in roles) {
        var role = roles[i];
        var id = getHtmlId(role, 'number');
        var label = role.name + '<br><span style="color: grey; font-size: 0.7em">(Avg. salary: ' + Globalize.format(role.salary, 'c')  + ')</span>';
        $("#attendance_roles").append('<p>\
            <label for="' + id +'">' + label + '</label><br/>\
            <input id="' + id +'" name="value" />\
            </p>');

        $("#" + id).spinner({
            min: 0,
            start: 0,
            stop: saveAttendanceNumbersToModel,
            change: saveAttendanceNumbersToModel,
        }).val(role.number);
    }            
}

function initPage() {
    initAttendance();

    $("#configure" ).button({
        icons: {
            primary: "ui-icon-wrench"
        },
        text: false
    }).click(function() {
        $("#configuration").dialog( "open" );
    });

    $("#start,#pause,#reset" ).button({});              
}

$(function() {
    initPage();
    initDialog();
});
