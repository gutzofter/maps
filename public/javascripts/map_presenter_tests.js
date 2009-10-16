test("isValidPresenter").should = function () {
    var presenter = newMapPresenter(null, null);

    this.is(presenter);
}

test("init").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);
    var view = mockView();

    var presenter = newMapPresenter(model, view);

    presenter.init();

    this.isEqual(3, view.count());
}

test("filterA").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);
    var view = mockView();

    var presenter = newMapPresenter(model, view);

    presenter.init();

    view.fireFilter('a')

    this.isEqual(2, view.count());
}

test("filterB").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);
    var view = mockView();

    var presenter = newMapPresenter(model, view);

    presenter.init();

    view.fireFilter('b')

    this.isEqual(1, view.count());
}

test("filterBThenAll").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);
    var view = mockView();

    var presenter = newMapPresenter(model, view);

    presenter.init();

    view.fireFilter('b')
    view.fireFilter('all')

    this.isEqual(3, view.count());
}

test("selectMarker").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);
    var view = mockView();

    var presenter = newMapPresenter(model, view);

    presenter.init();

    view.fireSelectMarker(2);

    this.isEqual(2, view.markerId);
}

function newMapPresenter(model, view) {
    var Presenter = new Object;

    Presenter.model = model;
    Presenter.view = view;

    Presenter.init = function() {
        this.model.fireAddMarker = this.addMarkerHandler;
        this.model.fireRemoveMarker = this.removeMarkerHandler;
        this.view.fireFilter = this.filterHandler;
        this.view.fireSelectMarker = this.selectMarkerHandler;
        this.model.fireOpenMarkerWindow = this.openMarkerWindowHandler;

        this.model.init();
    }

    Presenter.openMarkerWindowHandler = function(marker) {
        view.openMarkerWindow(marker);
    }

    Presenter.selectMarkerHandler = function(id) {
        model.selectMarker(id);
    }

    Presenter.filterHandler = function(tower_type) {
        model.filter(tower_type);
    }

    Presenter.addMarkerHandler = function(marker) {
        view.addMarker(marker);
    }

    Presenter.removeMarkerHandler = function(marker) {
        view.removeMarker(marker);
   }

    return Presenter;
}

//TODO create real view
function mockView() {
    var View = new Object();

    View.counter = 0;
    View.markerId = new Object();

    View.fireFilter = function() {}

    View.openMarkerWindow = function(marker) {
        this.markerId = marker.id
    }

    View.addMarker = function(marker) {
        this.counter++;
    }

    View.removeMarker = function(marker) {
        this.counter--;
    }

    View.count = function() {
        return this.counter;
    }

    return View;
}

