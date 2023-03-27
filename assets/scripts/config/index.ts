export namespace EventDefine {
  export enum ResLoadEvent {
    Load_Err = 'event_res_load_err',
    Load_End = 'event_res_load_end'
  }

  export enum LoadingEvent {
    Loading = 'event_loading'
  }

  export enum JoystickEvent {
    Rotate = 'event_rotate',
    Zoom = 'event_zoom',
    Move = 'event_move',
    Move_Stop = 'event_move_Stop'
  }
}