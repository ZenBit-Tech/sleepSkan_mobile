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

