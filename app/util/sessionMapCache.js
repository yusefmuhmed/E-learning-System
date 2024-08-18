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

    return sessionName;
  }

  static checkIfStudentHasSession(studentId) {
    for (const sessionName in SessionMap.sessions) {
      if (SessionMap.sessions[sessionName].studentId === studentId) {
        return sessionName;
      }
    }
    return false;
  }

  static checkIfTeacherHasSession(teacherId) {
    for (const sessionName in SessionMap.sessions) {
      if (SessionMap.sessions[sessionName].teacherId === teacherId) {
        return sessionName;
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
}

module.exports = SessionMap;
