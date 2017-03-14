//(function() {
    'use strict';
    
   // var app = angular.module('app');

    app.directive('ccImgPerson', ['config', function (config) {
        //Usage:
        //<img data-cc-img-person="{{s.speaker.imageSource}}"/>
        var basePath = config.imageSettings.imageBasePath;
        var unknownImage = config.imageSettings.unknownPersonImageSource;
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('ccImgPerson', function(value) {
                value = basePath + (value || unknownImage);
                attrs.$set('src', value);
            });
        }
    }]);

    app.directive('aDisabled', function() {
        return {
            compile: function(tElement, tAttrs, transclude) {
                //Disable href, based on class
                tElement.on("click", function(e) {
                    if (tElement.hasClass("disabled")) {
                        e.preventDefault();
                    }
                });
            
                //Disable ngClick
                tAttrs["ngClick"] = ("ng-click", "!("+tAttrs["aDisabled"]+") && ("+tAttrs["ngClick"]+")");
            
                //Toggle "disabled" to class when aDisabled becomes true
                return function (scope, iElement, iAttrs) {
                    scope.$watch(iAttrs["aDisabled"], function(newValue) {
                        if (newValue !== undefined) {
                            iElement.toggleClass("disabled", newValue);
                        }
                    });
                };
            }
        };
    });


    //app.directive('datepicker', [function () {
    //    return {
    //        restrict: 'A',
    //        require: 'ngModel',
    //        link: function (scope, element, attrs, ngModelCtrl) {

    //            element.datepicker({
    //                format: "mm-yyyy",
    //                minViewMode: "months", // or 1
    //                startDate: "01-1000",
    //                endDate: "12-9999",

    //                //viewMode: "months",
    //                //minViewMode: "months",

    //                orientation: "top left",
    //                autoclose: true,
    //                onSelect: function (date) {
    //                    ngModelCtrl.$setViewValue(date);
    //                    scope.$apply();
    //                }
    //            });
    //        }
    //    };
    //}]);


    app.directive('altiDatepicker', [altiDatePicker]);
 
    function altiDatePicker() {
        var mprefix = 'altidatePicker1234';
        var linkFunc= function(scope, elem, attrs) {
            scope[mprefix+'open'] = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
 
                scope[mprefix+'opened'] = true;
            };
        };
        return {
            restrict: 'AE',
            replace: true,
            scope:true,
            compile: function (element, attrs) {
                var html = '<p class="input-group">'+
                        '<input type="text" class="form-control" datepicker-popup="dd.MM.yyyy" ng-model="'+attrs.ngModel+'" is-open="'+mprefix+'opened" ng-required="true" date-disabled="disabled(date, mode)" ng-required="true" close-text="Close" />'
                        +'<span class="input-group-btn">'
                        +    '<button type="button" class="btn btn-default" ng-click="'+mprefix+'open($event)"><i class="glyphicon glyphicon-calendar"></i></button></span></p>';
                var e = angular.element(html);
                element.replaceWith(e);
                return linkFunc;
            }
        }
    }
 

    app.directive('ccSidebar', function () {
        // Opens and clsoes the sidebar menu.
        // Usage:
        //  <div data-cc-sidebar>
        // Creates:
        //  <div data-cc-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $dropdownElement.click(dropdown);

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    hideAllSidebars();
                    $sidebarInner.slideDown(350);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350);
                }

                function hideAllSidebars() {
                    $sidebarInner.slideUp(350);
                    $('.sidebar-dropdown a').removeClass(dropClass);
                }
            }
        }
    });


    app.directive('ccWidgetClose', function () {
        // Usage:
        // <a data-cc-widget-close></a>
        // Creates:
        // <a data-cc-widget-close="" href="#" class="wclose">
        //     <i class="fa fa-remove"></i>
        // </a>
        var directive = {
            link: link,
            template: '<i class="fa fa-remove"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('href', '#');
            attrs.$set('wclose');
            element.click(close);

            function close(e) {
                e.preventDefault();
                element.parent().parent().parent().hide(100);
            }
        }
    });

    app.directive('ccWidgetMinimize', function () {
        // Usage:
        // <a data-cc-widget-minimize></a>
        // Creates:
        // <a data-cc-widget-minimize="" href="#"><i class="fa fa-chevron-up"></i></a>
        var directive = {
            link: link,
            template: '<i class="fa fa-chevron-up"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            //$('body').on('click', '.widget .wminimize', minimize);
            attrs.$set('href', '#');
            attrs.$set('wminimize');
            element.click(minimize);

            function minimize(e) {
                e.preventDefault();
                var $wcontent = element.parent().parent().next('.widget-content');
                var iElement = element.children('i');
                if ($wcontent.is(':visible')) {
                    iElement.removeClass('fa fa-chevron-up');
                    iElement.addClass('fa fa-chevron-down');
                } else {
                    iElement.removeClass('fa fa-chevron-down');
                    iElement.addClass('fa fa-chevron-up');
                }
                $wcontent.toggle(500);
            }
        }
    });

    app.directive('ccScrollToTop', ['$window',
        // Usage:
        // <span data-cc-scroll-to-top></span>
        // Creates:
        // <span data-cc-scroll-to-top="" class="totop">
        //      <a href="#"><i class="fa fa-chevron-up"></i></a>
        // </span>
        function ($window) {
            var directive = {
                link: link,
                template: '<a href="#"><i class="fa fa-chevron-up"></i></a>',
                restrict: 'A'
            };
            return directive;

            function link(scope, element, attrs) {
                var $win = $($window);
                element.addClass('totop');
                $win.scroll(toggleIcon);

                element.find('a').click(function (e) {
                    e.preventDefault();
                    // Learning Point: $anchorScroll works, but no animation
                    //$anchorScroll();
                    $('body').animate({ scrollTop: 0 }, 500);
                });

                function toggleIcon() {
                    $win.scrollTop() > 300 ? element.slideDown(): element.slideUp();
                }
            }
        }
    ]);

    app.directive('ccSpinner', ['$window', function ($window) {
        // Description:
        //  Creates a new Spinner and sets its options
        // Usage:
        //  <div data-cc-spinner="vm.spinnerOptions"></div>
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.spinner = null;
            scope.$watch(attrs.ccSpinner, function (options) {
                if (scope.spinner) {
                    scope.spinner.stop();
                }
                scope.spinner = new $window.Spinner(options);
                scope.spinner.spin(element[0]);
            }, true);
        }
    }]);

    app.directive('ccWidgetHeader', function() {
        //Usage:
        //<div data-cc-widget-header title="vm.map.title"></div>
        var directive = {
            link: link,
            scope: {
                'title': '@',
                'subtitle': '@',
                'rightText': '@',
                'allowCollapse': '@'
            },
            templateUrl: 'app/layout/widgetheader.html',
            restrict: 'A',
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('class', 'widget-head');
        }
    });

    app.directive('jqbutton', function ($timeout) {
        var directive = {
            restrict: 'E', // says that this directive is only for html elements
            replace: true,        
            template: '<button></button>', 
            link: function (scope, element, attrs) {
                // turn the button into a jQuery button
                $timeout(function () {
                    /* set text from attribute of custom tag*/
                    element.text(attrs.text).button();
                }, 10);/* very slight delay, even using "0" works*/
            }
        };
        return directive;
    });

    app.directive('gaugeChart', [
    function () {
        return {
            restrict: 'A',
            scope: {
                data: '=',
                options: '='
            },
            link: function (scope, ele, attrs) {
                var data, gauge, options;
                data = scope.data;
                options = scope.options;
                gauge = new Gauge(ele[0]).setOptions(options);
                gauge.maxValue = data.maxValue;
                gauge.animationSpeed = data.animationSpeed;
                return gauge.set(data.val);
            }
        };
    }
    ]);

    app.directive('flotChart', [
    function () {
        return {
            restrict: 'A',
            scope: {
                data: '=',
                options: '='
            },
            link: function (scope, ele, attrs) {
                var data, options, plot;
                data = scope.data;
                options = scope.options;
                 return plot = $.plot(ele[0], data, options);
                //return plot = $.plot(ele, data, options);
            }
        };
    }
    ]);
    app.directive('flotChartRealtime', [
function () {
    return {
        restrict: 'A',
        link: function (scope, ele, attrs) {
            var data, getRandomData, plot, totalPoints, update, updateInterval;
            data = [];
            totalPoints = 300;
            getRandomData = function () {
                var i, prev, res, y;
                if (data.length > 0) {
                    data = data.slice(1);
                }
                while (data.length < totalPoints) {
                    prev = (data.length > 0 ? data[data.length - 1] : 50);
                    y = prev + Math.random() * 10 - 5;
                    if (y < 0) {
                        y = 0;
                    } else {
                        if (y > 100) {
                            y = 100;
                        }
                    }
                    data.push(y);
                }
                res = [];
                i = 0;
                while (i < data.length) {
                    res.push([i, data[i]]);
                    ++i;
                }
                return res;
            };
            update = function () {
                plot.setData([getRandomData()]);
                plot.draw();
                setTimeout(update, updateInterval);
            };
            data = [];
            totalPoints = 300;
            updateInterval = 200;
            plot = $.plot(ele[0], [getRandomData()], {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    shadowSize: 0
                },
                yaxis: {
                    min: 0,
                    max: 100
                },
                xaxis: {
                    show: false
                },
                grid: {
                    hoverable: true,
                    borderWidth: 1,
                    borderColor: '#eeeeee'
                },
                colors: ["#70b1cf"]
            });
            return update();
        }
    };
}
    ]);

    app.directive('flotCharts', function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {

                var chart = null,
                    options = {
                        xaxis: {
                            ticks: [[0, 'Daft'], [1, 'Punk']]
                        },
                        grid: {
                            labelMargin: 10,
                            backgroundColor: '#e2e6e9',
                            color: '#ffffff',
                            borderColor: null
                        }
                    };

                var data = scope[attrs.ngModel];

                // If the data changes somehow, update it in the chart
                scope.$watch('data', function (v) {
                    if (!chart) {
                        chart = $.plot(elem, v, options);
                        elem.show();
                    } else {
                        chart.setData(v);
                        chart.setupGrid();
                        chart.draw();
                    }
                });
            }
        };
    });

    //app.directive('flotChart', [
    //function () {
    //    return {
    //        restrict: 'A',
    //        scope: {
    //            data: '=',
    //            options: '='
    //        },
    //        link: function (scope, ele, attrs) {
    //            var data, options, plot;
    //            data = scope.data;
    //            options = scope.options;
    //            return plot = $.plot(ele[0], data, options);
    //        }
    //    };
    //}
    //]);

    //app.directive('flotChartRealtime', [
    //function () {
    //    return {
    //        restrict: 'A',
    //        link: function (scope, ele, attrs) {
    //            var data, getRandomData, plot, totalPoints, update, updateInterval;
    //            data = [];
    //            totalPoints = 300;
    //            getRandomData = function () {
    //                var i, prev, res, y;
    //                if (data.length > 0) {
    //                    data = data.slice(1);
    //                }
    //                while (data.length < totalPoints) {
    //                    prev = (data.length > 0 ? data[data.length - 1] : 50);
    //                    y = prev + Math.random() * 10 - 5;
    //                    if (y < 0) {
    //                        y = 0;
    //                    } else {
    //                        if (y > 100) {
    //                            y = 100;
    //                        }
    //                    }
    //                    data.push(y);
    //                }
    //                res = [];
    //                i = 0;
    //                while (i < data.length) {
    //                    res.push([i, data[i]]);
    //                    ++i;
    //                }
    //                return res;
    //            };
    //            update = function () {
    //                plot.setData([getRandomData()]);
    //                plot.draw();
    //                setTimeout(update, updateInterval);
    //            };
    //            data = [];
    //            totalPoints = 300;
    //            updateInterval = 200;
    //            plot = $.plot(ele[0], [getRandomData()], {
    //                series: {
    //                    lines: {
    //                        show: true,
    //                        fill: true
    //                    },
    //                    shadowSize: 0
    //                },
    //                yaxis: {
    //                    min: 0,
    //                    max: 100
    //                },
    //                xaxis: {
    //                    show: false
    //                },
    //                grid: {
    //                    hoverable: true,
    //                    borderWidth: 1,
    //                    borderColor: '#eeeeee'
    //                },
    //                colors: ["#70b1cf"]
    //            });
    //            return update();
    //        }
    //    };
    //}
    //]);

    app.directive('sparkline', [
    function () {
        return {
            restrict: 'A',
            scope: {
                data: '=',
                options: '='
            },
            link: function (scope, ele, attrs) {
                var data, options, sparkResize, sparklineDraw;
                data = scope.data;
                options = scope.options;
                sparkResize = void 0;
                sparklineDraw = function () {
                    return ele.sparkline(data, options);
                };
                $(window).resize(function (e) {
                    clearTimeout(sparkResize);
                    return sparkResize = setTimeout(sparklineDraw, 200);
                });
                return sparklineDraw();
            }
        };
    }
    ]);

    app.directive('morrisChart', [
    function () {
        var directive = {
            restrict: 'A',
            scope: {
                data: '=',
                type: '=',
                options: '='
            },
            link: function (scope, ele, attrs) {
                var data, func, options, type;
                data = scope.data;
                type = scope.type;
                switch (type) {
                    case 'line':
                        options = angular.extend({
                            element: ele[0],
                            data: data
                        }, scope.options);
                        return new Morris.Line(options);
                    case 'area':
                        options = angular.extend({
                            element: ele[0],
                            data: data
                        }, scope.options);
                        return new Morris.Area(options);
                    case 'bar':
                        options = angular.extend({
                            element: ele[0],
                            data: data
                        }, scope.options);
                        return new Morris.Bar(options);
                    case 'donut':
                        options = angular.extend({
                            element: ele[0],
                            data: data
                        }, scope.options);
                        if (options.formatter) {
                            func = new Function('y', 'data', options.formatter);
                            options.formatter = func;
                        }
                        return new Morris.Donut(options);
                }
            }
        };
        return directive;
    }
    ]);

    app.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
        $window = angular.element($window);
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        handler = function() {
          var elementBottom, remaining, shouldScroll, windowBottom;
          windowBottom = $window.height() + $window.scrollTop();
          elementBottom = elem.offset().top + elem.height();
          remaining = elementBottom - windowBottom;
          shouldScroll = remaining <= $window.height() * scrollDistance;
          if (shouldScroll && scrollEnabled) {
            if ($rootScope.$$phase) {
              return scope.$eval(attrs.infiniteScroll);
            } else {
              return scope.$apply(attrs.infiniteScroll);
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        $window.on('scroll', handler);
        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
        return $timeout((function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }), 0);
      }
    };
  }
]);


    app.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
    });

//lightbox directives

    app.directive('lightboxSrc', function ($window, cfpLoadingBar, Lightbox) {
        /**
         * Calculate the dimensions to display the image. The max dimensions
         *   override the min dimensions if they conflict.
         */
        var calculateImageDisplayDimensions = function (dimensions) {
            var w = dimensions.width;
            var h = dimensions.height;
            var minW = dimensions.minWidth;
            var minH = dimensions.minHeight;
            var maxW = dimensions.maxWidth;
            var maxH = dimensions.maxHeight;

            var displayW = w;
            var displayH = h;

            // resize the image if it is too small
            if (w < minW && h < minH) {
                // the image is both too thin and short, so compare the aspect ratios to
                // determine whether to min the width or height
                if (w / h > maxW / maxH) {
                    displayH = minH;
                    displayW = Math.round(w * minH / h);
                } else {
                    displayW = minW;
                    displayH = Math.round(h * minW / w);
                }
            } else if (w < minW) {
                // the image is too thin
                displayW = minW;
                displayH = Math.round(h * minW / w);
            } else if (h < minH) {
                // the image is too short
                displayH = minH;
                displayW = Math.round(w * minH / h);
            }

            // resize the image if it is too large
            if (w > maxW && h > maxH) {
                // the image is both too tall and wide, so compare the aspect ratios
                // to determine whether to max the width or height
                if (w / h > maxW / maxH) {
                    displayW = maxW;
                    displayH = Math.round(h * maxW / w);
                } else {
                    displayH = maxH;
                    displayW = Math.round(w * maxH / h);
                }
            } else if (w > maxW) {
                // the image is too wide
                displayW = maxW;
                displayH = Math.round(h * maxW / w);
            } else if (h > maxH) {
                // the image is too tall
                displayH = maxH;
                displayW = Math.round(w * maxH / h);
            }

            return {
                'width': displayW,
                'height': displayH
            };
        };

        return {
            'link': function (scope, element, attrs) {
                // resize the image and the containing modal
                var resize = function () {
                    // get the window dimensions
                    var windowWidth = $window.innerWidth;
                    var windowHeight = $window.innerHeight;

                    var imageWidth = scope.Lightbox.image.width;
                    var imageHeight = scope.Lightbox.image.height;

                    // calculate the max/min dimensions for the image
                    var imageDimensionLimits = Lightbox.calculateImageDimensionLimits({
                        'windowWidth': windowWidth,
                        'windowHeight': windowHeight,
                        'imageWidth': imageWidth,
                        'imageHeight': imageHeight
                    });

                    // calculate the dimensions to display the image
                    var imageDisplayDimensions = calculateImageDisplayDimensions(
                      angular.extend({
                          'width': imageWidth,
                          'height': imageHeight,
                          'minWidth': 1,
                          'minHeight': 1,
                          'maxWidth': 3000,
                          'maxHeight': 3000,
                      }, imageDimensionLimits)
                    );

                    // calculate the dimensions of the modal container
                    var modalDimensions = Lightbox.calculateModalDimensions({
                        'windowWidth': windowWidth,
                        'windowHeight': windowHeight,
                        'imageDisplayWidth': imageDisplayDimensions.width,
                        'imageDisplayHeight': imageDisplayDimensions.height
                    });

                    // resize the image
                    element.css({
                        'width': imageDisplayDimensions.width + 'px',
                        'height': imageDisplayDimensions.height + 'px'
                    });

                    // setting the height on .modal-dialog does not expand the div with the
                    // background, which is .modal-content
                    angular.element(
                      document.querySelector('.lightbox-modal .modal-dialog')
                    ).css({
                        'width': modalDimensions.width + 'px'
                    });

                    // .modal-content has no width specified; if we set the width on .modal-
                    // .content and not on.modal-dialog, .modal-dialog retains its default
                    // .width of 600px and that places .modal-content off center
                    angular.element(
                      document.querySelector('.lightbox-modal .modal-content')
                    ).css({
                        'height': modalDimensions.height + 'px'
                    });
                };

                // load the new image whenever the attr changes
                scope.$watch(function () {
                    return attrs.lightboxSrc;
                }, function (src) {
                    img = new Image();

                    // start loading the image
                    img.src = src;

                    // when the image has loaded
                    img.onload = function() {
                        // blank the image before resizing the element; see
                        // http://stackoverflow.com/questions/5775469/whats-the-valid-way-to-include-an-image-with-no-src
                        element[0].src = '//:0';

                        resize();

                        // show the image
                        element[0].src = src;

                        cfpLoadingBar.complete();
                    };
                });

                // resize the image and modal whenever the window gets resized
                angular.element($window).on('resize', resize);
            }
        };
    });

    //lightbox provider

    app.provider('Lightbox', function () {
        this.templateUrl = 'lightbox.html';

        /**
         * Calculate the max and min limits to the width and height of the displayed
         *   image (all are optional). The max dimensions override the min
         *   dimensions if they conflict.
         * @param  {Object} dimensions Contains the properties windowWidth,
         *   windowHeight, imageWidth, imageHeight.
         * @return {Object} May optionally contain the properties minWidth,
         *   minHeight, maxWidth, maxHeight.
         */
        this.calculateImageDimensionLimits = function (dimensions) {
            return {
                // 102px = 2 * (30px margin of .modal-dialog
                //              + 1px border of .modal-content
                //              + 20px padding of .modal-body)
                // with the goal of 30px side margins; however, the actual side margins
                // will be slightly less (at 22.5px) due to the vertical scrollbar
                'maxWidth': dimensions.windowWidth - 102,
                // 136px = 102px as above
                //         + 34px outer height of .lightbox-nav
                'maxHeight': dimensions.windowHeight - 136
            };
        };

        /**
         * Calculate the width and height of the modal. This method gets called
         *   after the width and height of the image, as displayed inside the modal,
         *   are calculated.
         * @param  {Object} dimensions Contains the properties windowWidth,
         *   windowHeight, imageDisplayWidth, imageDisplayHeight.
         * @return {Object} Must contain the properties width and height.
         */
        this.calculateModalDimensions = function (dimensions) {
            // 400px = arbitrary min width
            // 42px = 2 * (1px border of .modal-content
            //        + 20px padding of .modal-body)
            var width = Math.max(400, dimensions.imageDisplayWidth + 42);

            // 200px = arbitrary min height
            // 76px = 42px as above
            //        + 34px outer height of .lightbox-nav
            var height = Math.max(200, dimensions.imageDisplayHeight + 76);

            // first case:  the modal width cannot be larger than the window width
            //              20px = arbitrary value larger than the vertical scrollbar
            //                     width in order to avoid having a horizontal scrollbar
            // second case: Bootstrap modals are not centered below 768px
            if (width >= dimensions.windowWidth - 20 || dimensions.windowWidth < 768) {
                width = 'auto';
            }

            // the modal height cannot be larger than the window height
            if (height >= dimensions.windowHeight) {
                height = 'auto';
            }

            return {
                'width': width,
                'height': height
            };
        };

        this.$get = function service($document, $modal, $timeout, cfpLoadingBar) {
            // whether the lightbox is currently open; used in the keydown event handler
            var opened = false;

            // array of all images to be shown in the lightbox
            var images = [];

            // the index of the image currently shown (Lightbox.image)
            var index = 0;

            // the service object
            var Lightbox = {};

            // config
            Lightbox.templateUrl = this.templateUrl;
            Lightbox.calculateImageDimensionLimits = this.calculateImageDimensionLimits;
            Lightbox.calculateModalDimensions = this.calculateModalDimensions;

            // open the lightbox modal
            Lightbox.openModal = function (newImages, newIndex) {
                images = newImages;
                index = newIndex;
                Lightbox.image = images[index];
                cfpLoadingBar.start();

                $modal.open({
                    'templateUrl': Lightbox.templateUrl,
                    'controller': ['$scope', function ($scope) {
                        // $scope is the modal scope, a child of $rootScope
                        $scope.Lightbox = Lightbox;
                        opened = true;
                    }],
                    'windowClass': 'lightbox-modal'
                }).result.finally(function () {
                    cfpLoadingBar.complete();
                    opened = false;
                });
            };

            // helper for the image navigation methods below
            var setImage = function (newIndex) {
                index = newIndex;
                Lightbox.image = images[index];
                cfpLoadingBar.start();
            };
            Lightbox.firstImage = function () {
                setImage(0);
            };
            Lightbox.prevImage = function () {
                setImage((index - 1 + images.length) % images.length);
            };
            Lightbox.nextImage = function () {
                setImage((index + 1) % images.length);
            };
            Lightbox.lastImage = function () {
                setImage(images.length - 1);
            };

            /**
             * Call this method to set both the images array and the image object
             *   (based on the current index). A use case is when the images get
             *   changed dynamically in some way.
             */
            Lightbox.setImages = function (newImages) {
                images = newImages;
                Lightbox.image = images[index];
            };

            /**
             * Bind the left and right arrow keys for image navigation. This event
             *   handler never gets unbinded.
             */
            $document.bind('keydown', function (event) {
                if (opened) {
                    switch (event.which) {
                        case 39: // right arrow key
                            // don't know why the view doesn't update without this manual digest
                            $timeout(function () {
                                Lightbox.nextImage();
                            });
                            return false;
                        case 37: // left arrow key
                            $timeout(function () {
                                Lightbox.prevImage();
                            });
                            return false;
                    }
                }
            });

            return Lightbox;
        };
    });

    app.directive('fuFileBrowser', function () {
    return {
        restrict: 'EA',
        require: 'ngModel',
        replace: true,
        template: '<div><div><input type="file" style="cursor:pointer"/></div></div>',
        link: function (scope, element, attrs, ngModel) {
            var container = element.children();
            var bindFileControlChange = function () {
                var fileControl = container.children();
                fileControl.prop('multiple', attrs.fuMultiple !== undefined);
                fileControl.change(function (evt) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(evt.target.files);
                    });
                    if (attrs.fuResetable === undefined) {
                        return;
                    }
                    container.html(container.html()); // Reset must be done on div level
                    bindFileControlChange(); // Rebind after reset
                });
            };
            bindFileControlChange();
        }
    };
    });

    app.directive('fuFileDropper', function () {
        return {
            restrict: 'EA',
            require: 'ngModel',
            replace: true,
            transclude: true,
            template: '<div class="fu-drop-area" ng-transclude></div>',
            link: function (scope, element, attrs, ngModel) {
                var dropZone = element;
                var dropZoneDom = element.get(0);
                dropZoneDom.addEventListener('dragover', function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    evt.dataTransfer.dropEffect = 'copy';
                    dropZone.addClass("dragover");
                }, false);
                dropZoneDom.addEventListener('dragleave', function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    dropZone.removeClass("dragover");
                }, false);
                dropZoneDom.addEventListener('drop', function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    dropZone.removeClass("dragover");
                    scope.$apply(function () {
                        ngModel.$setViewValue(evt.dataTransfer.files);
                    });
                }, false);
            }
        };
    });


    app.directive('uploader', [function () {

        return {

            restrict: 'E',

            scope: {
                action: '@'
            },

            controller: ['$scope', function ($scope) {

                $scope.progress = 0;
                $scope.avatar = '';

                $scope.sendFile = function (el) {

                    console.info(el)

                    var $form = $(el).parents('form');

                    if ($(el).val() == '') {
                        return false;
                    }

                    $form.attr('action', $scope.action);

                    $scope.$apply(function () {
                        $scope.progress = 0;
                    });

                    $form.ajaxSubmit({

                        type: 'POST',
                        uploadProgress: function (event, position, total, percentComplete) {

                            $scope.$apply(function () {
                                // upload the progress bar during the upload
                                $scope.progress = percentComplete;
                            });

                        },
                        error: function (event, statusText, responseText, form) {

                            // remove the action attribute from the form
                            $form.removeAttr('action');

                            /*
                                handle the error ...
                            */

                        },
                        success: function (responseText, statusText, xhr, form) {

                            var ar = $(el).val().split('\\'),
                                filename = ar[ar.length - 1];

                            // remove the action attribute from the form
                            $form.removeAttr('action');

                            $scope.$apply(function () {
                                $scope.avatar = filename;
                            });

                        },

                    });

                }

            }],

            link: function (scope, elem, attrs, ctrl) {

                elem.find('.fake-uploader').click(function () {
                    elem.find('input[type="file"]').click();
                });

            },

            replace: false,

            templateUrl: 'app/uploader.html'

        };

    }]);

    app.directive('fileDropzone', function() {
        return {
            require: '^?form',
            restrict: 'A',
            scope: {
                file: '=',
                fileName: '=',
                dropzoneHoverClass: '@'
            },
            link: function(scope, element, attrs, form) {
                var checkSize, getDataTransfer, isTypeValid, processDragOverOrEnter, validMimeTypes;
                getDataTransfer = function(event) {
                    var dataTransfer;
                    return dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;
                };
                processDragOverOrEnter = function(event) {
                    if (event) {
                        element.addClass(scope.dropzoneHoverClass);
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                        if (event.stopPropagation) {
                            return false;
                        }
                    }
                    getDataTransfer(event).effectAllowed = 'copy';
                    return false;
                };
                validMimeTypes = attrs.fileDropzone;
                checkSize = function(size) {
                    var _ref;
                    if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
                        return true;
                    } else {
                        alert("File must be smaller than " + attrs.maxFileSize + " MB");
                        return false;
                    }
                };
                isTypeValid = function(type) {
                    if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
                        return true;
                    } else {
                        alert("Invalid file type. File must be one of following types " + validMimeTypes);
                        return false;
                    }
                };
                element.bind('dragover', processDragOverOrEnter);
                element.bind('dragenter', processDragOverOrEnter);
                element.bind('dragleave', function() {
                    return element.removeClass(scope.dropzoneHoverClass);
                });
                return element.bind('drop', function(event) {
                    var file, name, reader, size, type;
                    if (event != null) {
                        event.preventDefault();
                    }
                    element.removeClass(scope.dropzoneHoverClass);
                    reader = new FileReader();
                    reader.onload = function(evt) {
                        if (checkSize(size) && isTypeValid(type)) {
                            scope.$apply(function() {
                                scope.file = evt.target.result;
                                if (angular.isString(scope.fileName)) {
                                    return scope.fileName = name;
                                }
                            });
                            if (form) {
                                form.$setDirty();
                            }
                            return scope.$emit('file-dropzone-drop-event', {
                                file: scope.file,
                                type: type,
                                name: name,
                                size: size
                            });
                        }
                    };
                    file = getDataTransfer(event).files[0];
                    name = file.name;
                    type = file.type;
                    size = file.size;
                    reader.readAsDataURL(file);
                    return false;
                });
            }
        };
    });

    app.directive('upload', ['uploadManager', function factory(uploadManager) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).fileupload({
                    dataType: 'text',
                    add: function (e, data) {
                        uploadManager.add(data);
                    },
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        uploadManager.setProgress(progress);
                    },
                    done: function (e, data) {
                        uploadManager.setProgress(0);
                    }
                });
            }
        };
    }]);

    app.directive('uiEvent', ['$parse',
  function ($parse) {
      return function ($scope, elm, attrs) {
          var events = $scope.$eval(attrs.uiEvent);
          angular.forEach(events, function (uiEvent, eventName) {
              var fn = $parse(uiEvent);
              elm.bind(eventName, function (evt) {
                  var params = Array.prototype.slice.call(arguments);
                  //Take out first paramater (event object);
                  params = params.splice(1);
                  fn($scope, { $event: evt, $params: params });
                  if (!$scope.$$phase) {
                      $scope.$apply();
                  }
              });
          });
      };
  }]);


    app.directive('uiMultiselect', [function () {
	return {
		templateUrl: 'AppSecure/ui-multiselect.html',
		scope: {
			data: '=data',
			output: '=output'
		},
		link: function (scope, element, attrs) {
			scope.query = "";
			scope.limitFilter = attrs.limitFilter; // limits # of items shown in selector
			scope.width = attrs.width;

			scope.$watch('output', function (newValue) {
				if (newValue.length === 0) {
					scope.placeholder = attrs.placeholder ? attrs.placeholder : ''
				} else scope.placeholder = '';
			}, true); // set placeholder & remove when there's output to save space

			scope.$watch('query', function (newValue) {
				var length = scope.placeholder.length;
				if (newValue.length > 0) length = newValue.length;
				scope.inputWidth = 10 + length * 6;
			}); // expand input box width based on content

			scope.addItem = function (item) {
				scope.output.push(item);
				scope.query = [];
			};
			scope.removeItem = function (position) {
				scope.output.splice(position, 1); // splice @ exact location
			};

			scope.focusChoice = []; // clears focus on any chosen item for del

			scope.focus = function () {
				scope.focusInput = true;
				scope.selectorPosition = 0; // start @ first item
			};
			scope.blur = function () {
				scope.focusInput = false;
			};

			scope.hoverSelector = false;
			scope.showSelector = false;
			scope.$watch('[focusInput, hoverSelector]', function (newValue) {
				scope.showSelector = newValue.some(function (element) {return element});
			}, true); // selector should still show if input still focused, even if not hovered

			scope.keyParser = function ($event) {
				var keys = {
					38: 'up',
					40: 'down',
					8 : 'backspace',
					13: 'enter',
					9 : 'tab',
					27: 'esc'
				};
				var key = keys[$event.keyCode];
				var queryIsEmpty = scope.query.length === 0;

				if (!key || (key === 'backspace' && !queryIsEmpty)) {
					// backspace should work when query isn't empty
					scope.selectorPosition = 0;
				} else {
					var atTop = scope.selectorPosition === 0;
					var atBottom = scope.selectorPosition === scope.filteredData.length - 1;
					var choiceFocused = scope.focusChoice[scope.output.length - 1] === true;
					var filteredDataExists = scope.filteredData.length > 0;

					if (key === 'up') {
						if (atTop || !scope.selectorPosition) {
							scope.selectorPosition = scope.filteredData.length - 1;
						} else scope.selectorPosition--;
					} else if (key === 'down') {
						if (atBottom) {
							scope.selectorPosition = 0;
						} else scope.selectorPosition++;
					} else if (key === 'backspace') {
						if (choiceFocused) {
							scope.removeItem(scope.output.length - 1);
							scope.focusChoice = [];
						} else scope.focusChoice[scope.output.length - 1] = true;
					} else if ((key === 'enter' || key === 'tab') && filteredDataExists) {
						scope.addItem(scope.filteredData[scope.selectorPosition], scope.output.length);
					} else if (key === 'esc' && !!scope.focusChoice) scope.focusChoice = [];

					$event.preventDefault();
				}
			}; // keyboard shortcuts

		}
	}
}]);

    app.directive("compareTo", [ function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    }]);


app.filter('underline', [function () {
	return function (text, query) {
		if (query.length > 0 || angular.isNumber(query)) {
			text = text.toString(); query = query.toString();
			return text.replace(new RegExp(query, 'gi'), '<span class="underline">$&</span>');
		} else return text;
	};
}]);

    app.filter('unique', function () {
        return function (items, filterOn) {
            if (filterOn == false) {
                return items;
            } else {
                if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                    var hashCheck = {}, newItems = [];
                    var extractValueToCompare = function (item) {
                        if (angular.isObject(item) && angular.isString(filterOn)) {
                            return item[filterOn];
                        } else {
                            return item;
                        }
                    };

                    angular.forEach(items, function (item) {
                        var valueToCheck, isDuplicate = false;
                        for (var i = 0; i < newItems.length; i++) {
                            if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                                isDuplicate = true;
                                break;
                            }
                        }
                        if (!isDuplicate) {
                            newItems.push(item);
                        }
                    });
                    items = newItems;
                }
                return items;
            };

            
		//if (query.length > 0 || angular.isNumber(query)) {
		//	text = text.toString(); query = query.toString();
		//	return text.replace(new RegExp(query, 'gi'), '<span class="underline">$&</span>');
		//} else return text;
	};
    });

    app.filter('uniques', function () {
        return function (arr, field) {
            var o = {}, i, l = arr.length, r = [];
            for (i = 0; i < l; i++) {
                o[arr[i][field]] = arr[i];
            }
            for (i in o) {
                r.push(o[i]);
            }
            return r;
        };
    });

    app.directive('fileReader', function () {
        return {
            scope: {
                fileReader: "="
            },
            link: function (scope, element) {
                $(element).on('change', function (changeEvent) {
                    var files = changeEvent.target.files;
                    if (files.length) {
                        var r = new FileReader();
                        r.onload = function (e) {
                            var contents = e.target.result;
                            scope.$apply(function () {
                                scope.fileReader = contents;
                            });
                        };

                        r.readAsText(files[0]);
                    }
                });
            }
        };
    });


     
//})();