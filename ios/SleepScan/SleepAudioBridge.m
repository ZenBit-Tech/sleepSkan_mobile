#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(RecordAudioService, NSObject)

RCT_EXTERN_METHOD(StartAudioService:(NSString *)filePathName
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(StopAudioService:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

@end
// ---- Events export ----
@interface RCT_EXTERN_MODULE(RecordAudioEvents, RCTEventEmitter)
@end

// #import <React/RCTBridgeModule.h>

// @interface RCT_EXTERN_MODULE(SleepAudio, NSObject)
// RCT_EXTERN_METHOD(configure:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
// RCT_EXTERN_METHOD(reactivateSession:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
// RCT_EXTERN_METHOD(beginFiniteTask:(NSString *)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
// RCT_EXTERN_METHOD(endFiniteTask:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
// @end
