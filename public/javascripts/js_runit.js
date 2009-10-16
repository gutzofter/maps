
// ============================================================
//        **** A JSNUnit 2.6 Testing Framework ****
//
//          Written by Troy Taft (email@troytaft.com)
//          (c) Troy Taft, 2006.  Permission is granted to use 
//          this software freely under the conditions of 
//          ValleyHighlands Free License.
//
//     Purpose:  The purpose of this code is to encapsulate
//               objects that are used by the JavaScript Unit
//               Testing Framework.
//
//               This JavaScript file includes the TestDisplay class
//               the Test class, and the Registry class.  It also
//               contains the functions: TestRunner, 
//               DisplayAndRunAllTests, and RunAllTests.
//
// ============================================================
//
//
//

function newTestRegistry() {
    var TestRegistry = new Object;
    TestRegistry.registryArray = new Array();

    TestRegistry.AddTest = function(theTest) {
        this.registryArray[this.registryArray.length] = theTest;
    }
    return TestRegistry;
}

var registry = newTestRegistry();

function displayTests() {
    document.getElementById('testDisplayOutput').innerHTML = DisplayAndRunAllTests();
}

function newTestDisplay() {
    var TestDisplay = new Object;
    TestDisplay.TestCount = 0;
    TestDisplay.CheckCount = 0;
    TestDisplay.TestsPass = true;
    TestDisplay.OutputBuffer = "";

    TestDisplay.SetUp = function() { 
        this.TestCount = 0;
        this.CheckCount = 0;
        this.TestsPass = true;
        this.OutputBuffer = "";
    }

    TestDisplay.LogFatalError = function(TestCaseName) {
        this.TestsPass = false;
        this.OutputBuffer += "<LI style=\"color: red; font-weight: bold\">";
        this.OutputBuffer += "Fatal Error in " + TestCaseName;
        this.OutputBuffer += "</LI>\n";
    }

    TestDisplay.IncrementTestCounter = function() { 
        this.TestCount++;
    }

    TestDisplay.LogPassingAssertion = function(CaseName, TestTitle) {
        //this.OutputBuffer += "<LI style=\"color: green\">";
        //this.OutputBuffer += TestTitle + ": Passed. " + "(" + CaseName + ")";
        //this.OutputBuffer += "</LI>\n";
        this.CheckCount++;
    }

    TestDisplay.LogFailingAssertion = function(CaseName, TestTitle) {
        this.TestsPass = false;
        this.OutputBuffer += "<div>";
        if(TestTitle) {
            this.OutputBuffer += TestTitle + " --> ";
        }
        this.OutputBuffer += "Failed: " + "<b style=\"color: red\">" + CaseName + "</b>";
        this.OutputBuffer += "</div>\n";
    }

    TestDisplay.LogFailingEqualsAssertion = function(CaseName, Expected, Actual, TestTitle) {
        this.TestsPass = false;
        this.OutputBuffer += "<div>";
        if(TestTitle) {
            this.OutputBuffer += TestTitle + " --> ";
        }
        this.OutputBuffer += "Failed: " + "<b style=\"color: red\">" + CaseName + "</b>";
        this.OutputBuffer += "<ul>\n";
        this.OutputBuffer += "<li>";
        this.OutputBuffer += "Expected: &nbsp;" + Expected;
        this.OutputBuffer += "</li>\n";
        this.OutputBuffer += "<li>";
        this.OutputBuffer += "Actual :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + Actual;
        this.OutputBuffer += "</li>\n";
        this.OutputBuffer += "</ul>\n";
        this.OutputBuffer += "</div>\n";
    }

    TestDisplay.LogErrorException = function(caseName, exception) {
        this.TestsPass = false;
        this.OutputBuffer += '<span>Error: ' + "<b style=\"color: red\">" + caseName + "</b></span>";
        this.OutputBuffer += "<ul>\n";
        this.OutputBuffer += "<li>";
        this.OutputBuffer += exception.message;
        this.OutputBuffer += "</li>\n";
        this.OutputBuffer += "<li>";
        this.OutputBuffer += 'File: ' + exception.fileName;
        this.OutputBuffer += "</li>\n";
        this.OutputBuffer += "<li>";
        this.OutputBuffer += '@ Line: ' + exception.lineNumber;
        this.OutputBuffer += "</li>\n";
        this.OutputBuffer += "</ul>\n";
    }

    TestDisplay.logTraceMessage = function(caseName, message) {
        this.OutputBuffer += '<span>Trace: ' + "<b>" + caseName + "</b></span>\n";
        this.OutputBuffer += "<ul>\n";
        this.OutputBuffer += "<li>\n";
        this.OutputBuffer += "<b>" + message + "</b>\n";

        this.OutputBuffer += "</li>\n";
        this.OutputBuffer += "</ul>\n";

    }

    TestDisplay.Output = function() {
        if(this.TestsPass){
            this.OutputBuffer += "<h2 style=\"color: green\">Pass</h2>\n";
            this.OutputBuffer += "<span style=\"color: green\">Test count: " + this.TestCount + 
                ", Check count: " + this.CheckCount + "</span>\n";
        } else {
            this.OutputBuffer += "<h2 style=\"color: red\">Fail</h2>\n";
        }
        return this.OutputBuffer;
    }
    return TestDisplay;
}

function should(testName) {
//need to figure out how to change to remove duplicatiion

    var Test = new Object;
    Test.name = testName;
    registry.AddTest(Test);

    Test.setUpDisplay = function(TestDisplay) {
        this.TestDisplay = TestDisplay;
    }

    Test.executeWithCatch = function() {
        try {
            this.test();
        }
        catch(e) {
            this.TestDisplay.LogErrorException(this.name, e);
        }
    }

    Test.test = function() {}

    Test.tearDown = function() {
        this.TestDisplay.IncrementTestCounter();
    }

    Test.TestCount = function() {return 1;}

    Test.assert = function(Test, Title) {
        if (Test) {
            this.TestDisplay.LogPassingAssertion(this.name, Title);
        } else {
            this.TestDisplay.LogFailingAssertion(this.name, Title);
        }
    }

    Test.fail = function(Message) {
        this.assert((false), Message);
    }
    
    // Need to change from using the fail to regular output with test banner
    Test.debugTrace = function(message) {
        this.TestDisplay.logTraceMessage(this.name, message);
    }

    Test.is = function(test, title) {
        this.assert(test, title);
    }

    Test.isNot = function(test, title) {
        this.is((test != null), title);
    }

    Test.isFalse = function(test, title) {
        this.isNotEqual(true, test, title);
    }

     Test.isTrue = function(bool, title) {
        this.is((true == bool), title);
    }

   Test.isEqual = function(expected, actual, message) {
        if (expected == actual) {
            this.TestDisplay.LogPassingAssertion(this.name, message);
        } else {
            this.TestDisplay.LogFailingEqualsAssertion(this.name, expected, actual, message);
        }
    }

    Test.isNotEqual = function(expected, actual, message) {
        this.assert((expected != actual), message);
    }

    return Test;

}

function TestRunner(Test, TestDisplay)
{
    Test.setUpDisplay(TestDisplay);
    Test.executeWithCatch();
    Test.tearDown();
}

function DisplayAndRunAllTests()
{
    var thisTestDisplay = newTestDisplay();
    thisTestDisplay.SetUp();
    RunAllTests(thisTestDisplay);
    return thisTestDisplay.Output();
}

function RunAllTests(aTestDisplay)
{
    for (var i=0; i < registry.registryArray.length; i++)
    {
        TestRunner(registry.registryArray[i], aTestDisplay);
    }
}

function errorMessage(exception) {
    return '<p>Error: ' + exception.message + '</p>'
            + '<p>@ Line: ' + exception.lineNumber + '</p>';
}

