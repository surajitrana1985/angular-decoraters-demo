(function() {
    'use strict';

    angular
        .module('decoratorApp', []);

}());

(function() {
    'use strict';

    angular
        .module('decoratorApp')
        .controller('mainCtrl', MainController)
        .config(DecoratorConfig)
        .directive('customLog', CustomLogDirective);

    MainController.$inject = ['$scope', '$log', '$timeout'];
    DecoratorConfig.$inject = ['$provide'];
    CustomLogDirective.$inject = ['$log'];

    function MainController($scope, $log, $timeout) {
        var vm = this;

        init();

        function init() {
            var types = ['error', 'warn', 'log', 'info', 'debug'],
                i;
            for (i = 0; i < types.length; i++) {
                $log[types[i]](types[i] + " : message " + (i + 1));
            }

            $timeout(function() {
                $log.info('info: message logged in timeout');
            }, 10000);
        }

    }

    function DecoratorConfig($provide) {
        $provide.decorator('$log', ['$delegate', function logDecorator($delegate) {
            var myLog = {
                error: function(msg) {
                    log(msg, 'error');
                },
                warn: function(msg) {
                    log(msg, 'warn');
                },
                log: function(msg) {
                    log(msg, 'log');
                },
                info: function(msg) {
                    log(msg, 'info');
                },
                debug: function(msg) {
                    log(msg, 'debug');
                },
                stack: []
            };

            function log(msg, type) {
                myLog.stack.push({ type: type, message: msg });
                if (console && console[type]) {
                    console[type](msg);
                }
            }
            return myLog;
        }]);
    }

    function CustomLogDirective($log) {

        function compile() {
            return function(scope) {
                scope.myLog = $log.stack;
            }
        }

        return {
            compile: compile,
            restrict: 'E',
            scope: {},
            template: '<ul id="myLog"><li ng-repeat="l in myLog" class="{{l.type}}">{{l.message}}</li></ul>'
        }
    }

}());