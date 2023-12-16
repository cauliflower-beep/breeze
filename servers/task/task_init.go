package task

import "time"

type TimerFunc func(interface{}) bool

// Timer
//
//	@Description:
//	@param delay 首次延时
//	@param tick 间隔
//	@param fun 定时执行function
//	@param param fun参数
//	@param funcDefer
//	@param paramDefer
func Timer(delay, tick time.Duration, fun TimerFunc, param interface{}, funcDefer TimerFunc, paramDefer interface{}) {
	go func() {
		defer func() {
			if funcDefer != nil {
				funcDefer(paramDefer)
			}
		}()

		if fun == nil {
			return
		}

		t := time.NewTimer(delay)
		defer t.Stop()

		for {
			select {
			case <-t.C:
				if fun(param) == false {
					return
				}
				t.Reset(tick)
			}
		}
	}()
}
