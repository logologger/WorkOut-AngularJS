'use strict';
angular.module('7minWorkout').factory('workoutHistoryTracker',['$rootScope','localStorageService',function($rootScope,localStorageService)
{
var maxHistoryItems=20;
//var workoutHistory=[];
var currentWorkoutLog=null;
var storageKey="workouthistory";
var workoutHistory=localStorageService.get(storageKey) || [];
var service={};
service.startTracking=function()
{

currentWorkoutLog={
startedOn:new Date().toISOString(),
completed:false,
exercisesDone:0
};
localStorageService.add(storageKey,workoutHistory);
if(workoutHistory.length >= maxHistoryItems)
{
	workoutHistory.shift();
}
else
{
	workoutHistory.push(currentWorkoutLog);
}
};
service.endTracking=function(completed)
{
	currentWorkoutLog.completed=completed;
	currentWorkoutLog.endedOn=new Date().toISOString();
	currentWorkoutLog=null;
	localStorageService.add(storageKey,workoutHistory);
};
service.getHistory=function()
{
	return workoutHistory;
};
//here you are applying events on $rootScope

//event name is $routeChangeSucess means on tranisition of root from one to other 
//the following function should execute 
//here the function does the task of stopping tracking for exercise that is being done by the user
$rootScope.$on('$routeChangeSuccess',function(e,args)
{
if(currentWorkoutLog)
{
	service.endTracking(false);
}

});
$rootScope.$on("event:workout:exerciseStarted",function(e,args)
{
	currentWorkoutLog.lastExercise=args.title;
  ++currentWorkoutLog.exercisesDone;
  localStorageService.add(storageKey,workoutHistory);
});

return service;


}]);
/* Services */