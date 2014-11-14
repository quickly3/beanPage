/*
 * beanPage v1.0.0 
 * Copyright D_bean 
 * 
 */

+(function($) {
	"use strict";

	// Pagination public class definition
	// ===================================

	var Pagination = function(element, options) {
		var $this, i, page;
		this.page = 0;
		this.$element = $(element);
		this.id = this.$element.attr("id");
		this.options = $.extend({}, Pagination.DEFAULTS, options);
		this.$bar = $(this.options.bar);
		this.nowPage = 1;
		this.chilren = this.$element.children(this.options.children_selector);
		this.chil_len = this.chilren.length;

		for (i = 0; i < this.chil_len; i++) {
			this.page = Math.ceil((i + 1) / this.options.pageBar);

			this.chilren.eq(i).addClass("page-dom").attr({
				"data-page": this.page
			});

		}

		if (this.page === 0) {
			this.endPage = 1;
		} else {
			this.endPage = this.page;
		}

		// page init
		this.init();

	}

	Pagination.VERSION = "1.0.0";

	Pagination.DEFAULTS = {
		children_selector: "",
		bar: "body",
		pageBar: 8,
		prev_show: true,
		next_show: true,
		previous_str: "上一页",
		next_str: "下一页",
		prev_end: "已经是第一页",
		next_end: "已经是最后一页",
		checkBar: true,
		border1: 2,
		border2: 3

	}

	Pagination.prototype.init = function() {


		this.toPage(this.nowPage);
		
	}

	// build pagination bar in options.bar 
	Pagination.prototype.barBuild = function() {
		var i, elem, pageDiv, prevBtn, nextBtn, prevSpan, nextSpan, pageSpan,
			pageArr = [],
			res = [],
			hash = {},
			pageObj = [],
			mark = 'init',
			b_start, b_end;

		this.$barChildren = this.$bar.children("[data-target=#" + this.id + "]");

		
		if (this.$barChildren.length !== 0) {
			this.$barChildren.remove();
		}

		this.endPage = parseInt(this.endPage);
		this.nowPage = parseInt(this.nowPage);
		pageDiv = $("<div>").attr({
			"data-target": "#" + this.id,
			"class": "pagination"
		});
		if (this.options.prev_show === true) {
			prevSpan = $("<span>").attr({
				"class": "page-prev",
				"data-target": "#" + this.id,
				"data-page-to": "prev"
			}).html(this.options.previous_str).appendTo(pageDiv);
		}

		if (this.options.checkBar === true) {

			for (i = 0; i <= this.options.border1; i++) {
				pageArr.push(1 + i);
				pageArr.push(this.endPage - i);
			}

			for (i = 0; i <= this.options.border2; i++) {
				pageArr.push(this.nowPage + i);
				pageArr.push(this.nowPage - i);
			}


			pageArr.sort();
			for (i = 0, elem;
				(elem = pageArr[i]) != null; i++) {
				if (!hash[elem]) {
					if (elem > 0 && elem <= this.endPage) res.push(elem);
					hash[elem] = true;
				}
			}
			pageArr = res;

			for (i = 1; i <= this.endPage; i++) {
				if ($.inArray(i, pageArr) !== -1) {
					switch (mark) {
						case 'init':
							break;
						case 'start':
							mark = "end";
							b_end = i;
							pageObj.push({
								text: '...',
								val: Math.ceil((b_start + b_end) / 2)
							});
							break;
						case 'end':
							break;
					}
					pageObj.push({
						text: i,
						val: i
					});
				} else {
					switch (mark) {
						case 'init':
							mark = "start";
							b_start = i;
							break;
						case 'start':
							break;
						case 'end':
							mark = "start";
							b_start = i;
							break;
					}
				}
			}
			for (i in pageObj) {
				pageSpan = $("<span>").attr({
					"class": "pageBtn",
					"data-target": "#" + this.id,
					"data-page-to": pageObj[i].val
				}).text(pageObj[i].text).appendTo(pageDiv);
			}

		} else {
			for (i = 1; i <= this.endPage; i++) {
				pageSpan = $("<span>").attr({
					"class": "pageBtn",
					"data-target": "#" + this.id,
					"data-page-to": i
				}).text(i).appendTo(pageDiv);
			}
		}

		if (this.options.next_show === true) {
			nextSpan = $("<span>").attr({
				"class": "page-next",
				"data-target": "#" + this.id,
				"data-page-to": "next"
			}).html(this.options.next_str).appendTo(pageDiv);
		}
		pageDiv.appendTo(this.$bar);
	}

	// to any page 
	Pagination.prototype.toPage = function(page) {
		var success = 1;

		this.nowPage = parseInt(this.nowPage);
		this.endPage = parseInt(this.endPage);
		if (typeof page === "string") {
			switch (page) {
				case "prev":
					if (this.nowPage === 1) {
						if (typeof this.options.prev_end === "string") {
							alert(this.options.prev_end);
						} else if ($.isFunction(this.options.prev_end)) {
							this.options.prev_end();
						}

						success = 0;
					}
					page = this.nowPage - 1;
					break;
				case "next":
					if (this.nowPage === this.endPage) {
						if (typeof this.options.next_end === "string") {
							alert(this.options.next_end);
						} else if ($.isFunction(this.options.next_end)) {
							this.options.next_end();
						}
						success = 0;
					}
					page = this.nowPage + 1;
					break;
			}
		} else {
			var pageBtn = $(".pages[data-page=" + page + "]", ".pagination[data-target=" + this.id + "]");
			pageBtn.addClass("page-active");
		}

		if (success === 1) {
			this.nowPage = page;
			this.showPage(page);
		}
		this.barBuild();
	}

	Pagination.prototype.showPage = function(page) {
		$(".page-dom").hide();
		$(".page-dom[data-page=" + page + "]").show();
		if (this.checkBar === true) {
			this.checkBar(page);
		}
	}

	Pagination.prototype.prevPage = function() {
		return this.toPage("prev");
	}

	Pagination.prototype.nextPage = function() {
		return this.toPage("next");
	}

	// Pagination plugin definition
	// ===============================
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this),
				data = $this.data('bean.pagination'),
				options = $.extend({}, Pagination.DEFAULTS, $this.data(), typeof option == 'object' && option),
				page = typeof option == 'number' ? option : 1;

			if (!data) $this.data('bean.pagination', (data = new Pagination(this, options)))

			if (typeof option == 'number') data.toPage(option)
		})
	}


	var old = $.fn.pagination;

	$.fn.pagination = Plugin;
	$.fn.pagination.Construcor = Pagination;

	//Pagination no conflict
	//==========================

	$.fn.pagination.noConflict = function() {
		$.fn.pagination = old
		return this
	}

	var clickHandler = function(e) {
		var $this = $(this),
			$target = $($this.attr('data-target')),
			options = $.extend({}, $target.data(), $this.data()),
			pageIndex = $this.attr('data-page-to');

		$target.data('bean.pagination').toPage(pageIndex);

		e.preventDefault()
	}

	$(document).on('click.bean.pagination.data-api', '[data-page-to]', clickHandler);
})(jQuery);
