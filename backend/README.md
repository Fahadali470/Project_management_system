# TaskFlow Pro Backend

This backend is the Phase 3 Django REST foundation for TaskFlow Pro.

## Included

- Django project structure under `backend/taskflow_backend`.
- Feature apps under `backend/apps`.
- Custom user model.
- Workspace, membership, project, task, comment, attachment, checklist, and activity models.
- Model relationships and database indexes.
- Django REST Framework serializers and ModelViewSets.
- Generic auth views for register and current user.
- JWT access and refresh token endpoints through SimpleJWT.
- Workspace membership permissions.
- Services layer for workspace creation, project progress, member sync, and task movement.
- Signals for project progress and activity events.
- API versioning under `/api/v1/`.
- Pagination, searching, filtering, and ordering defaults.
- PostgreSQL support through `DATABASE_URL`.
- Redis cache settings.
- Celery app and Redis broker/result backend settings.

## Local Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Main Endpoints

```text
POST /api/v1/auth/register/
POST /api/v1/auth/token/
POST /api/v1/auth/token/refresh/
GET  /api/v1/auth/me/
GET  /api/v1/workspaces/
GET  /api/v1/workspaces/current/
GET  /api/v1/projects/
GET  /api/v1/tasks/
POST /api/v1/tasks/{id}/move/
GET  /api/v1/activity-events/
```

## Architecture

```text
taskflow_backend
  -> settings
  -> urls
  -> celery
apps
  -> accounts
  -> workspaces
  -> projects
  -> tasks
  -> core
```

## Production Notes

- Use PostgreSQL in production through `DATABASE_URL`.
- Use Redis for cache and Celery.
- Keep `DJANGO_SECRET_KEY` private.
- Keep frontend route guards as UX only; backend permissions enforce real access.
- Add migrations after changing models.
