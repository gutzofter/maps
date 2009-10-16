should('pass').test = function() {
    this.is(true, "A Passing Test");
}

should('isEqual').test = function() {
    this.isEqual(1, 1, "A Passing Test");
}

should('isTrue').test = function() {
    this.isTrue(true, "A Passing Test");
}

should("generate failing assertion").test = function() {
    var disp = newTestDisplay();

    disp.LogFailingAssertion("", "");

    this.isEqual("%3Cdiv%3EFailed%3A%20%3Cb%20style%3D%22color%3A%20red%22%3E%3C/b%3E%3C/div%3E%0A%3Ch2%20style%3D%22color%3A%20red%22%3EFail%3C/h2%3E%0A", escape(disp.Output()));

}


//failing tests
//should('is').test = function() {
//    this.is(null, "failed is");
//}
//
//should('isEqual').test = function() {
//    this.isEqual(1, 2, "failed isEqual");
//}
//
//should('isTrue').test = function() {
//    this.isTrue(false, "failed isTrue");
//}
//
//should('exception').test = function() {
//    this.is(noFunction(), "error");
//}
//
