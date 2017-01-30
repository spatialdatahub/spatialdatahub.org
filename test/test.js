describe("DOM Tests", function () {
    var el = document.createElement("div");
    el.id = "myDiv";
    el.innerHTML = "Hi there!";
    el.style.background = "#ccc";
    document.body.appendChild(el);
 
    var myEl = document.getElementById('myDiv');
    it("is in the DOM", function () {
        assert.notEqual(myEl, null);
    });
 
    it("is a child of the body", function () {
        assert.equal(myEl.parentElement, document.body);
    });
 
    it("has the right text", function () {
        assert.equal(myEl.innerHTML, "Hi there!");
    });
 
    it("has the right background", function () {
        assert.equal(myEl.style.background, "rgb(204, 204, 204)");
    });
});
