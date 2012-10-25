describe('Rectangle', function () {
	
	var rectangle;

	beforeEach(function () {
		rectangle = new app.Rectangle();
	});
	
	describe('with length 7 and width 4', function (){
		
		beforeEach(function (){
			rectangle.set({
				length : 7,
				width : 4
			});
		});

		it('should have a area of 28', function(){
			expect(rectangle.area()).toBe(28);
		});

		it('should have a perimeter of 22', function (){
			expect(rectangle.perimeter()).toBe(22);
		});
	});

	describe('with equal length and width', function () {
		beforeEach(function (){
			rectangle.set({
				length : 5,
				width : 5
			})
		});

		it('should be a square', function (){
			expect(rectangle.isSquare()).toBe(true);
		})
	});

	describe('with unequal length and width', function () {
		beforeEach(function (){
			rectangle.set({
				length : 5,
				width : 3
			})
		});

		it('should not be a square', function (){
			expect(rectangle.isSquare()).not.toBe(true);
		})
	});


	describe('setting invalid values', function (){

		describe('negative length or width', function (){

			it("should throw error if the length or width is set to a negative value", function (){
				function setDimensions(){
					rectangle.set({
						length : 5,
						width : -1
					})
				}

				expect(setDimensions).toThrow();
			});

		});

		describe('zero length or width', function (){

			it("should throw error if the length or width is set to zero", function (){
				function setDimensions(){
					rectangle.set({
						length : 0,
						width : 2
					})
				}

				expect(setDimensions).toThrow();
			});

		})
	})
})