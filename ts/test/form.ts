require('should');

import Vld = require('../index');
import Form = Vld.Form;

describe('validation form', () => {
	var form = new Form();
	form.addField('id')
		.addRule('trim')
		.addRule('isInt');
	form.addField('name')
		.addRule('trim')
		.addRule('required')
		.addRule('isLength', 0, 32);
	form.addField('comment')
		.addRule('trim')
		.addRule('isLength', 0, 128);

	it('id and name: success', () => {
		var result = form.validate({
			'id': ' 5 ',
			'name': 'NAME',
		});
		result.success.should.equal(true);
	});

	it('id and name: invalid id', () => {
		var result = form.validate({
			'id': 'invalid',
			'name': 'NAME',
		});
		result.success.should.equal(false);
		result.get('id').error.rule.should.equal('isInt');
	});

});