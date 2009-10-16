/******************************************************
Here are three sample tests.

The tests will pass because there the two failing tests
shown below are commented out.

If you un-comment them out and see how failure works.

*******************************************************/
newTest("FirstTest").Execute = function() {
    this.Assert(true, "A Passing Test");
}

newTest("SecondTest").Execute = function() {
    this.Assert(false, "A Failing Test");
}

newTest("thirdTest").Execute = function () {
	this.AreEqual("Expected Text", "Actual Text", "Another Failing Test");
}

newTest("fourthTest").Execute = function () {
	this.Fail("Fourth Failing Test");
}

newTest("fifthTest").Execute = function () {
	this.AreNotEqual(1, 2, "Fifth Test");
}

newTest("noFunction").Execute = function () {
	this.AreEqual(1, noFunction(), "Functon is undefined");
}
