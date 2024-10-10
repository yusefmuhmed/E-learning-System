class SessionMap {
  static sessions = {};

  static generateSession(studentId, teacherId, durationInMinutes) {
    const randomNumber = Math.floor(100 + Math.random() * 900);
    const sessionName = `session${randomNumber}`;

    const now = new Date();
    const sessionStart = now.toISOString();
    const sessionEnd = new Date(
      now.getTime() + durationInMinutes * 60000
    ).toISOString();

    const session = {
      teacherId,
      studentId,
      sessionPassword: sessionName,
      sessionStart,
      sessionEnd,
    };

    SessionMap.sessions[sessionName] = session;

    return session;
  }

  static checkIfStudentHasSession(studentId) {
    if (!SessionMap.sessions || Object.keys(SessionMap.sessions).length === 0) {
      return false;
    }

    for (const sessionName in SessionMap.sessions) {
      if (SessionMap.sessions[sessionName].studentId === studentId) {
        return SessionMap.sessions[sessionName];
      }
    }
    return false;
  }

  static checkIfTeacherHasSession(teacherId) {
    if (!SessionMap.sessions || Object.keys(SessionMap.sessions).length === 0) {
      return false;
    }

    for (const sessionName in SessionMap.sessions) {
      if (SessionMap.sessions[sessionName].teacherId === teacherId) {
        return SessionMap.sessions[sessionName];
      }
    }
    return false;
  }

  static deleteExpiredSessions() {
    const now = new Date();
    for (const sessionName in SessionMap.sessions) {
      if (SessionMap.sessions[sessionName].sessionEnd < now.toISOString()) {
        delete SessionMap.sessions[sessionName];
      }
    }
  }

  static getSession(sessionName) {
    return SessionMap.sessions[sessionName];
  }

  static deleteSession(sessionName) {
    const session = SessionMap.sessions[sessionName];
    return { status: delete SessionMap.sessions[sessionName], session };
  }

  static deleteStudentIdFromSession(sessionName) {
    const session = SessionMap.sessions[sessionName];
    if (session) {
      session.studentId = null;
      return { status: true, session };
    }
  }
}

module.exports = SessionMap;
